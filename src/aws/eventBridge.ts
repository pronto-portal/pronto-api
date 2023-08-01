import AWS from "aws-sdk";

export const eventBridge = new AWS.EventBridge({ apiVersion: "2015-10-07" });
