import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import putPlayerHandler from '@/handler/putPlayer';
import { RESPONSE_HEADERS } from './constants';
import logger from './logger';

export const playerHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const client = new DynamoDb({ region: 'ap-southeast-2' });
    const mapper = new DataMapper({ client });
    logger.info(`player handler`);
    logger.info(`player event: ${event.path}`);

    switch (event.path) {
        case '/player-result':
            return putPlayerHandler(event, mapper);
        default:
            return {
                statusCode: 400,
                headers: RESPONSE_HEADERS,
                body: JSON.stringify({ error: 'invalid request' }),
            };
    }
};
