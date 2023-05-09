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
    console.log('player result', playerResult);
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
