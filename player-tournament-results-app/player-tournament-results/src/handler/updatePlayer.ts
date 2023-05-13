import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { createUpdatePlayerResult } from '@/mapper/eventMapper';
import { get, update } from '@/dao/playerResultDao';
import errorResponse from '@/error/errorHandler';
import PlayerResult from '@/model/PlayerResult';
import logger from '@/logger';
import { getApiResponse } from '@/Utils';

export default async (
    playerResultId: string,
    event: APIGatewayProxyEvent,
    dataMapper: DataMapper,
): Promise<APIGatewayProxyResult> => {
    let playerResult = new PlayerResult();
    playerResult.id = playerResultId;
    try {
        playerResult = await get(playerResult, dataMapper);
    } catch (e: unknown) {
        logger.warn(`payer result id ${playerResultId} not found`);
        return getApiResponse(404, JSON.stringify({ error: `player result id ${playerResultId} not found` }));
    }

    try {
        const updatePlayerResult = await createUpdatePlayerResult(playerResult, event);
        const savedPlayerResult = await update(updatePlayerResult, dataMapper);
        console.dir(savedPlayerResult);
        return getApiResponse(200, JSON.stringify(savedPlayerResult));
    } catch (e: unknown) {
        return errorResponse(e);
    }
};
