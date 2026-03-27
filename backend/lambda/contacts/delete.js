import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

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
    
    await docClient.send(new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: { contactId: id }
    }));
    
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
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
