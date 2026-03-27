import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://raghavshah01.github.io",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,x-api-key"
};

export const handler = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing contactId" })
      };
    }
    
    const body = JSON.parse(event.body || "{}");
    const lastUpdated = new Date().toISOString();
    
    // Recompute followUpDate if outreachDate changed
    if (body.outreachDate) {
      const dateObj = new Date(body.outreachDate);
      dateObj.setDate(dateObj.getDate() + 3);
      body.followUpDate = dateObj.toISOString().split("T")[0];
    }
    
    body.lastUpdated = lastUpdated;
    
    let updateExpression = "set ";
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    
    const keys = Object.keys(body);
    if (keys.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Empty update body" })
      };
    }
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      updateExpression += `#${key} = :${key}`;
      if (i < keys.length - 1) updateExpression += ", ";
      
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = body[key];
    }
    
    const data = await docClient.send(new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: { contactId: id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    }));
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data.Attributes)
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
