import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import mapFromEventToPlayerReuslt from '@/mapper/eventMapper';
import savePlayerResult from '@/dao/playerResultDao';
import { RESPONSE_HEADERS } from '@/constants';
import errorResponse from '@/error/errorHandler';

export default async (event: APIGatewayProxyEvent, dataMapper: DataMapper): Promise<APIGatewayProxyResult> => {
    let savedPlayerResult;
    try {
        const playerResult = await mapFromEventToPlayerReuslt(event);
        savedPlayerResult = await savePlayerResult(playerResult, dataMapper);
        return {
            statusCode: 201,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(savedPlayerResult),
        };
    } catch (e: unknown) {
        return errorResponse(e);
    }
};
