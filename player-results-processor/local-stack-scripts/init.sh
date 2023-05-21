#!/bin/bash
echo "########### Setting up player_rankings Dynamodb Table ##########"

aws dynamodb create-table \
    --table-name player_rankings \
    --endpoint-url http://localhost:4566 \
    --region ap-southeast-2 \
    --billing-mode PAY_PER_REQUEST \
    --key-schema \
        AttributeName=firstName,KeyType=HASH \
        AttributeName=lastName,KeyType=RANGE \
    --attribute-definitions \
        AttributeName=firstName,AttributeType=S \
        AttributeName=lastName,AttributeType=S \