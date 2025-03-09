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

    const vpc = ec2.Vpc.fromLookup(this, "DefaultVpc", { isDefault: true });

    const rdsSecurityGroup = new ec2.SecurityGroup(this, "RdsSecurityGroup", {
      vpc,
      description: "Security group for our PostgreSQL RDS instance",
      allowAllOutbound: true,
    });

    const dbSecret = new secretsmanager.Secret(this, "DBSecret", {
      secretName: "appointments-rds-credentials",
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "postgres" }),
        generateStringKey: "password",
        excludePunctuation: true,
      },
    });

    const dbInstance = new rds.DatabaseInstance(this, "RdsPostgresInstance", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17,
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [rdsSecurityGroup],
      credentials: rds.Credentials.fromSecret(dbSecret),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
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
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(5432),
      "Allow connections from inside the VPC",
    );

    const fn = new NodejsFunction(this, "ApiFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "handler",
      entry: path.join(__dirname, "../src/handler.ts"),
      timeout: cdk.Duration.seconds(60),
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
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      environment: {
        JWT_SECRET: dbSecret.secretArn,
        DB_HOST: dbInstance.dbInstanceEndpointAddress,
        DB_PORT: dbInstance.dbInstanceEndpointPort,
        DB_SECRET_ARN: dbSecret.secretArn,
        DB_NAME,
      },
    });
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
    new apigw.LambdaRestApi(this, "ApiFunctionGateway", {
      handler: fn,
    });
    dbSecret.grantRead(fn);
    dbInstance.connections.allowFrom(
      fn,
      ec2.Port.tcp(5432),
      "Allow Lambda to access PostgreSQL",
    );

    // lambda just to run migrations on deployment
    const migrationFn = new NodejsFunction(this, "MigrationFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../migrations/handler.ts"),
      handler: "handler",
      vpc: vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
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
      securityGroups: [rdsSecurityGroup],
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
    dbInstance.connections.allowFrom(
      migrationFn,
      ec2.Port.tcp(5432),
      "Allow Migration Lambda to access PostgreSQL",
    );
    migrationTrigger.node.addDependency(dbInstance);
  }
}
