#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { AppointmentsStack } from "../lib/stack";

const app = new App();
new AppointmentsStack(app, "appointments", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
