import HttpError from '@/error/HttpError';
import PlayerResult from '@/model/PlayerResult';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { playerResultSchema } from '@/model/schema/valdidationSchema';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createPlayerResult = (body: any): PlayerResult => {
    const playerResult = new PlayerResult();
    playerResult.firstName = body['firstName'];
    playerResult.lastName = body['lastName'];

    const playerDateOfBirth = new Date(body['dateOfBirth']);

    if (isNaN(playerDateOfBirth.getDay())) {
        throw new HttpError(400, { error: 'invalid date provided' });
    }

    playerResult.dateOfBirth = playerDateOfBirth;
    playerResult.tournament = body['tournament'];
    playerResult.points = body['points'];
    return playerResult;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUpdatePlayerResult = (playerResultId: string, body: any): PlayerResult => {
    const playerResult = new PlayerResult();

    playerResult.id = playerResultId;
    if (body['firstName']) {
        playerResult.firstName = body['firstName'];
    }

    if (body['lastName']) {
        playerResult.lastName = body['lastName'];
    }

    if (body['dateOfBirth']) {
        const playerDateOfBirth = new Date(body['dateOfBirth']);

        if (isNaN(playerDateOfBirth.getDay())) {
            throw new HttpError(400, { error: 'invalid date provided' });
        }
        playerResult.dateOfBirth = playerDateOfBirth;
    }

    if (body['tournament']) {
        playerResult.tournament = body['tournament'];
    }

    if (body['points']) {
        playerResult.points = body['points'];
    }

    return playerResult;
};

export default async (apiGatewayEvent: APIGatewayProxyEvent): Promise<PlayerResult> => {
    if (apiGatewayEvent.body) {
        const body = JSON.parse(apiGatewayEvent.body);
        await playerResultSchema.validate(body);
        return createPlayerResult(body);
    }

    throw new HttpError(400, { error: 'payload not found' });
};

export const mapFromUpdateEventToPlayerReuslt = async (
    playerResultId: string,
    apiGatewayEvent: APIGatewayProxyEvent,
): Promise<PlayerResult> => {
    if (apiGatewayEvent.body) {
        const body = JSON.parse(apiGatewayEvent.body);
        return createUpdatePlayerResult(playerResultId, body);
    }

    throw new HttpError(400, { error: 'payload not found' });
};
