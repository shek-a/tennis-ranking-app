import { afterEach, beforeAll, beforeEach, expect, describe, it } from '@jest/globals';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { playerRankingsHandler } from './app';
import { createApiEvent, createPlayerRanking } from './testUtils';
import PlayerRanking from './model/PlayerRanking';

describe('test player rankings handler', () => {
    let dataMapper: DataMapper;
    let player1: PlayerRanking;
    let player2: PlayerRanking;

    beforeAll(() => {
        const client = new DynamoDb({ endpoint: process.env.DYNAMODB_ENDPOINT, region: 'ap-southeast-2' });
        dataMapper = new DataMapper({ client });
    });

    beforeEach(async () => {
        player1 = await dataMapper.put(createPlayerRanking('Roger', 'Federer', '1980-02-16', 2000));
        player2 = await dataMapper.put(createPlayerRanking('Rafa', 'Nadal', '1986-03-05', 3000));
    });

    afterEach(async () => {
        dataMapper.delete(
            Object.assign(new PlayerRanking(), { firstName: player1.firstName, lastName: player1.lastName }),
        );
        dataMapper.delete(
            Object.assign(new PlayerRanking(), { firstName: player2.firstName, lastName: player2.lastName }),
        );
    });

    it('should get all player raking records', async () => {
        const event = createApiEvent('GET');

        const result = await playerRankingsHandler(event);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).length).toBe(2);
    });

    it('should get filtered player ranking records', async () => {
        const event = createApiEvent('GET', {
            firstName: 'Rafa',
            lastName: 'Nadal',
        });

        const result = await playerRankingsHandler(event);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).length).toBe(1);
    });
});
