import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import putPlayerHandler from '@/handler/putPlayer';
import { RESPONSE_HEADERS } from './constants';

export const playerHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDb({ region: process.env.AWS_REGION });
    const mapper = new DataMapper({ client });

    switch (event.path) {
        case 'PUT /player-result':
            return putPlayerHandler(event, mapper);
        default:
            return {
                statusCode: 400,
                headers: RESPONSE_HEADERS,
                body: 'invalid request',
            };
    }
};
