import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://raghavshah01.github.io",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,x-api-key"
};

export const handler = async (event) => {
  try {
    const data = await docClient.send(new ScanCommand({
      TableName: process.env.TABLE_NAME
    }));
    
    let items = data.Items || [];
    // Sort by outreachDate descending
    items.sort((a, b) => new Date(b.outreachDate) - new Date(a.outreachDate));
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(items)
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
