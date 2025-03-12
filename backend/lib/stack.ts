import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as customresources from "aws-cdk-lib/custom-resources";
import * as path from "path";

export class AppointmentsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const DB_NAME = "appointments";
    const stackName = cdk.Stack.of(this).stackName;

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "application",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const rdsSecurityGroup = new ec2.SecurityGroup(this, "RdsSecurityGroup", {
      securityGroupName: `${stackName}-rds-sg`,
      description: "Security group for our PostgreSQL RDS instance",
      vpc,
    });

    const lambdasSecurityGroup = new ec2.SecurityGroup(
      this,
      "LambdasSecurityGroup",
      {
        securityGroupName: `${stackName}-fn-sg`,
        description: "Security group for our Lambdas",
        allowAllOutbound: true,
        vpc,
      },
    );

    const dbSecret = new secretsmanager.Secret(this, "DBSecret", {
      secretName: `${stackName}-rds-credentials`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "postgres" }),
        generateStringKey: "password",
        excludePunctuation: true,
      },
    });

    vpc.addInterfaceEndpoint("SecretsManagerEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    const dbInstance = new rds.DatabaseInstance(this, "RdsPostgresInstance", {
      multiAz: false,
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17,
      }),
      vpc,
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }),
      securityGroups: [rdsSecurityGroup],
      credentials: rds.Credentials.fromSecret(dbSecret),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO,
      ),
      backupRetention: cdk.Duration.days(0),
      storageType: rds.StorageType.GP2,
      deleteAutomatedBackups: true,
      databaseName: DB_NAME,
      allocatedStorage: 20,
      publiclyAccessible: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    rdsSecurityGroup.addIngressRule(
      lambdasSecurityGroup,
      ec2.Port.tcp(5432),
      "Lambda to Postgres database",
    );

    const apiFn = new NodejsFunction(this, "ApiFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "handler",
      entry: path.join(__dirname, "../src/lambda.ts"),
      timeout: cdk.Duration.seconds(30),
      vpc: vpc,
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }),
      securityGroups: [lambdasSecurityGroup],
      bundling: {
        minify: true,
        sourceMap: true,
        commandHooks: {
          beforeBundling() {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [`cp ${inputDir}/global-bundle.pem ${outputDir}`];
          },
          beforeInstall() {
            return [];
          },
        },
      },
      environment: {
        JWT_SECRET: dbSecret.secretArn,
        DB_HOST: dbInstance.dbInstanceEndpointAddress,
        DB_PORT: dbInstance.dbInstanceEndpointPort,
        DB_SECRET_ARN: dbSecret.secretArn,
        DB_NAME,
      },
    });

    new apigw.LambdaRestApi(this, "ApiFunctionGateway", {
      handler: apiFn,
    });

    dbSecret.grantRead(apiFn);

    // lambda just to run migrations on deployment
    const migrationFn = new NodejsFunction(this, "MigrationFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../migrations/handler.ts"),
      handler: "handler",
      vpc: vpc,
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }),
      securityGroups: [lambdasSecurityGroup],
      timeout: cdk.Duration.minutes(1),
      bundling: {
        minify: true,
        sourceMap: true,
        commandHooks: {
          beforeBundling() {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [
              `cp -r ${inputDir}/migrations/sql ${outputDir}`,
              `cp ${inputDir}/global-bundle.pem ${outputDir}`,
            ];
          },
          beforeInstall() {
            return [];
          },
        },
      },
      environment: {
        DB_HOST: dbInstance.dbInstanceEndpointAddress,
        DB_PORT: dbInstance.dbInstanceEndpointPort,
        DB_SECRET_ARN: dbSecret.secretArn,
        DB_NAME,
      },
    });

    // this is just to not repeat myself
    const triggers = {
      service: "Lambda",
      action: "invoke",
      parameters: {
        FunctionName: migrationFn.functionName,
        InvocationType: "Event",
      },
      physicalResourceId: customresources.PhysicalResourceId.of(
        Date.now().toString(),
      ),
    };

    const migrationTrigger = new customresources.AwsCustomResource(
      this,
      "MigrationTrigger",
      {
        onCreate: triggers,
        onUpdate: triggers,
        policy: customresources.AwsCustomResourcePolicy.fromStatements([
          new PolicyStatement({
            actions: ["lambda:InvokeFunction"],
            resources: [migrationFn.functionArn],
          }),
        ]),
      },
    );

    dbSecret.grantRead(migrationFn);
    migrationTrigger.node.addDependency(dbInstance);
  }
}
