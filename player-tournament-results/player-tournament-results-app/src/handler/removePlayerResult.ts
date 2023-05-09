import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { get, remove } from '@/dao/playerResultDao';
import { getApiResponse } from '@/common';
import PlayerResult from '@/model/PlayerResult';
import errorResponse from '@/error/errorHandler';
import logger from '@/logger';

export default async (event: APIGatewayProxyEvent, dataMapper: DataMapper): Promise<APIGatewayProxyResult> => {
    if (!event?.pathParameters?.id) {
        return getApiResponse(400, JSON.stringify({ error: 'player result id is required as a path parameter' }));
    }
    let playerResultId;
    try {
        playerResultId = event.pathParameters.id;
        let playerResult = new PlayerResult();
        playerResult.id = playerResultId;
        playerResult = await get(playerResult, dataMapper);
    } catch (e: unknown) {
        logger.warn(`player result id ${playerResultId} not found.`);
        return getApiResponse(404, JSON.stringify({ error: `player result id ${playerResultId} not found` }));
    }

    try {
        await remove(playerResultId, dataMapper);
        return getApiResponse(200, JSON.stringify({ message: `player result id ${playerResultId} removed` }));
    } catch (e: unknown) {
        return errorResponse(e);
    }
};
