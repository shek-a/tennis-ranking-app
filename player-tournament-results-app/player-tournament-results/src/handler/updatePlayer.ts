import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { mapFromUpdateEventToPlayerReuslt } from '@/mapper/eventMapper';
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
    try {
        if (await playerToUpdateExists(playerResultId, dataMapper)) {
            const playerResult = await mapFromUpdateEventToPlayerReuslt(playerResultId, event);
            const savedPlayerResult = await update(playerResult, dataMapper);
            return getApiResponse(200, JSON.stringify(savedPlayerResult));
        } else {
            return getApiResponse(404, JSON.stringify({ error: `player result id ${playerResultId} not found` }));
        }
    } catch (e: unknown) {
        return errorResponse(e);
    }
};

const playerToUpdateExists = async (playerResultId: string, dataMapper: DataMapper): Promise<boolean> => {
    const playerResult = new PlayerResult();
    playerResult.id = playerResultId;
    try {
        await get(playerResult, dataMapper);
    } catch (e: unknown) {
        logger.warn(`payer result id ${playerResultId} not found`);
        return false;
    }
    return true;
};
