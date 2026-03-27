#!/bin/bash
set -e

STACK_NAME=${1:-linkedin-tracker}
REGION=${2:-us-east-1}
BUCKET_NAME="${STACK_NAME}-artifacts-$(uuidgen | tr 'A-Z' 'a-z')"

cd "$(dirname "$0")"

echo "Creating S3 bucket for artifacts ($BUCKET_NAME)..."
aws s3 mb s3://$BUCKET_NAME --region $REGION || true

echo "Packaging Lambda code..."
aws cloudformation package \
  --template-file cloudformation/template.yaml \
  --s3-bucket $BUCKET_NAME \
  --output-template-file cloudformation/packaged.yaml \
  --region $REGION

echo "Deploying CloudFormation stack..."
aws cloudformation deploy \
  --template-file cloudformation/packaged.yaml \
  --stack-name $STACK_NAME \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --region $REGION

echo "Deployment complete. Here are your outputs:"
aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs' \
  --output table
