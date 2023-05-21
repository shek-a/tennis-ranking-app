import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import getPlayerRankingsHandler from '@/handler/getPlayerRankings';
import { getApiResponse } from './common';

export const tournamentResultsProcessorHandler = async (
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
    const client = getDynamoDbClient();
    const mapper = new DataMapper({ client });

    if (event.httpMethod === 'GET') {
        return getPlayerRankingsHandler(event, mapper);
    }

    return getApiResponse(400, JSON.stringify({ error: 'invalid request' }));
};

const getDynamoDbClient = (): DynamoDb => {
    return process.env.DYNAMODB_ENDPOINT
        ? new DynamoDb({ endpoint: process.env.DYNAMODB_ENDPOINT, region: 'ap-southeast-2' })
        : new DynamoDb({ region: process.env.AWS_REGION });
};
