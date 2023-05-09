import { afterEach, beforeAll, beforeEach, expect, describe, it } from '@jest/globals';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { playerResultsHandler } from './app';
import { createApiEvent, createPlayerResult } from './testUtils';
import PlayerResult from './model/PlayerResult';

describe('test player results handler', () => {
    let dataMapper: DataMapper;
    let player1: PlayerResult;
    let player2: PlayerResult;
    beforeAll(() => {
        const client = new DynamoDb({ endpoint: process.env.DYNAMODB_ENDPOINT, region: 'ap-southeast-2' });
        dataMapper = new DataMapper({ client });
    });

    beforeEach(async () => {
        player1 = await dataMapper.put(createPlayerResult('Roger', 'Federer', '1980-02-16', '2008 French Open', 2000));
        player2 = await dataMapper.put(createPlayerResult('Rafa', 'Nadal', '1986-03-05', '2022 French Open', 3000));
    });

    afterEach(async () => {
        dataMapper.delete(Object.assign(new PlayerResult(), { id: player1.id }));
        dataMapper.delete(Object.assign(new PlayerResult(), { id: player2.id }));
    });

    it('should put player result record', async () => {
        const event = createApiEvent(
            'PUT',
            JSON.stringify(createPlayerResult('Novak', 'Djokovic', '1987-06-08', '2023 Australian Open', 2000)),
        );

        const result = await playerResultsHandler(event);
        expect(result.statusCode).toBe(201);

        const playerId = JSON.parse(result.body).id;
        const playerResults = await getPlayerResults();
        expect(playerResults.length).toBe(3);

        dataMapper.delete(Object.assign(new PlayerResult(), { id: playerId }));
    });

    it('should get all player result records', async () => {
        const event = createApiEvent('GET');

        const result = await playerResultsHandler(event);
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).length).toBe(2);
    });

    it('should get filtered player result records', async () => {
        const event = createApiEvent(
            'GET',
            '',
            {},
            {
                lastName: 'Nadal',
            },
        );

        const result = await playerResultsHandler(event);
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body).length).toBe(1);
    });

    it('should modify existing player result record', async () => {
        const event = createApiEvent('PUT', JSON.stringify({ points: 5000 }), { id: player1.id });

        const result = await playerResultsHandler(event);
        expect(result.statusCode).toBe(200);

        expect(JSON.parse(result.body).points).toBe(5000);
    });

    const getPlayerResults = async (): Promise<Array<PlayerResult>> => {
        const playerResults: Array<PlayerResult> = [];
        for await (const playerResult of dataMapper.scan(PlayerResult)) {
            playerResults.push(playerResult);
        }
        return playerResults;
    };
});
