import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import mapFromEventToPlayerResult from '@/mapper/eventMapper';
import { put } from '@/dao/playerResultDao';
import errorResponse from '@/error/errorHandler';
import { getApiResponse } from '@/Utils';

export default async (event: APIGatewayProxyEvent, dataMapper: DataMapper): Promise<APIGatewayProxyResult> => {
    try {
        const playerResult = await mapFromEventToPlayerResult(event);
        const savedPlayerResult = await put(playerResult, dataMapper);
        return getApiResponse(201, JSON.stringify(savedPlayerResult));
    } catch (e: unknown) {
        return errorResponse(e);
    }
};
