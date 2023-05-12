import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import putPlayerHandler from '@/handler/putPlayer';
import updatePlayerHandler from '@/handler/updatePlayer';
import logger from './logger';
import { getApiResponse } from './Utils';

export const playerHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDb({ region: 'ap-southeast-2' });
    const mapper = new DataMapper({ client });
    logger.info(`http method: ${event.httpMethod}`);
    switch (event.httpMethod) {
        case 'PUT':
            if (event.pathParameters && event.pathParameters.id) {
                return updatePlayerHandler(event.pathParameters.id, event, mapper);
            }
            return putPlayerHandler(event, mapper);
        default:
            return getApiResponse(400, JSON.stringify({ error: 'invalid request' }));
    }
};
