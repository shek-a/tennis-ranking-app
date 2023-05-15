#!/bin/bash
echo "########### Setting up player_tournment_results Dynamodb Table ##########"

aws dynamodb create-table \
    --table-name player_tournment_results \
    --endpoint-url http://localhost:4566 \
    --region ap-southeast-2 \
    --billing-mode PAY_PER_REQUEST \
    --key-schema AttributeName=id,KeyType=HASH \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=firstName,AttributeType=S \
        AttributeName=lastName,AttributeType=S \
        AttributeName=tournament,AttributeType=S \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"first_name-index\",
                \"KeySchema\": [
                    {\"AttributeName\":\"firstName\",\"KeyType\":\"HASH\"}
                ],
                \"Projection\": {
                    \"ProjectionType\":\"ALL\"
                }
            },
            {
                \"IndexName\": \"last_name-index\",
                \"KeySchema\": [
                    {\"AttributeName\":\"lastName\",\"KeyType\":\"HASH\"}
                ],
                \"Projection\": {
                    \"ProjectionType\":\"ALL\"
                }
            },
            {
                \"IndexName\": \"tournament-index\",
                \"KeySchema\": [
                    {\"AttributeName\":\"tournament\",\"KeyType\":\"HASH\"}
                ],
                \"Projection\": {
                    \"ProjectionType\":\"ALL\"
                }
            }
        ]"        