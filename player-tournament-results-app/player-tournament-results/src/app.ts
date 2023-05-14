import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import removePlayerResultHandler from '@/handler/removePlayerResult';
import getPlayerResultsHandler from '@/handler/getPlayerResults';
import putPlayerResultHandler from '@/handler/putPlayerResult';
import updateResultPlayerHandler from '@/handler/updatePlayerResult';
import { getApiResponse } from './common';

export const playerResultsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDb({ region: 'ap-southeast-2' });
    const mapper = new DataMapper({ client });
    switch (event.httpMethod) {
        case 'PUT':
            if (event?.pathParameters?.id) {
                return updateResultPlayerHandler(event.pathParameters.id, event, mapper);
            }
            return putPlayerResultHandler(event, mapper);
        case 'GET':
            return getPlayerResultsHandler(event, mapper);
        case 'DELETE':
            return removePlayerResultHandler(event, mapper);
        default:
            return getApiResponse(400, JSON.stringify({ error: 'invalid request' }));
    }
};
