import serverless from "@codegenie/serverless-express";
import app from ".";
export const handler = serverless({ app });
