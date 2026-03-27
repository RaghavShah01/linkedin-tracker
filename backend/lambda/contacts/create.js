import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://raghavshah01.github.io",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,x-api-key"
};

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { name, outreachType, autoDetected } = body;
    
    if (!name || !outreachType) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing required fields: name, outreachType" })
      };
    }
    
    const contactId = crypto.randomUUID();
    const outreachDate = body.outreachDate || new Date().toISOString().split("T")[0];
    
    // Compute followUpDate = outreachDate + 3 days
    const dateObj = new Date(outreachDate);
    dateObj.setDate(dateObj.getDate() + 3);
    const followUpDate = dateObj.toISOString().split("T")[0];
    
    const item = {
      contactId,
      name,
      title: body.title || "",
      company: body.company || "",
      linkedinUrl: body.linkedinUrl || "",
      contactType: body.contactType || "Other",
      roleTheyreHiring: body.roleTheyreHiring || "",
      outreachType,
      outreachDate,
      status: body.status || "Sent",
      followUpDate,
      noteText: body.noteText || "",
      autoDetected: !!autoDetected,
      lastUpdated: new Date().toISOString()
    };
    
    await docClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: item
    }));
    
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(item)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
