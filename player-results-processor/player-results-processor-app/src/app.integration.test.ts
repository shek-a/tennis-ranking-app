import { afterEach, beforeAll, beforeEach, expect, describe, it } from '@jest/globals';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import PlayerRanking from './model/PlayerRanking';
import { createDynamoDBStreamEvent, createPlayerRanking } from './testUtils';
import { playerResultsProcessorHandler } from './app';

describe('test player results processor handler', () => {
    let dataMapper: DataMapper;
    let player1: PlayerRanking;

    beforeAll(() => {
        const client = new DynamoDb({ endpoint: process.env.DYNAMODB_ENDPOINT, region: 'ap-southeast-2' });
        dataMapper = new DataMapper({ client });
    });

    beforeEach(async () => {
        player1 = await dataMapper.put(createPlayerRanking('Roger', 'Federer', '1980-02-16', 2000));
    });

    afterEach(async () => {
        dataMapper.delete(
            Object.assign(new PlayerRanking(), { firstName: player1.firstName, lastName: player1.lastName }),
        );
        await delay(100);
    });

    it('should create new player ranking ranking record on a INSERT event', async () => {
        await playerResultsProcessorHandler(createDynamoDBStreamEvent('INSERT', 'Rafa', 'Nadal'));
        await delay(100);

        const playerRanking = await getPlayerRanking('Rafa', 'Nadal', dataMapper);
        assertPlayerRanking(playerRanking, 'Rafa', 'Nadal', 3000);

        dataMapper.delete(Object.assign(new PlayerRanking(), { firstName: 'Rafa', lastName: 'Nadal' }));
    });

    it('should update new player ranking ranking record with points on a INSERT event', async () => {
        await playerResultsProcessorHandler(createDynamoDBStreamEvent('INSERT', 'Roger', 'Federer'));
        await delay(100);

        const playerRanking = await getPlayerRanking('Roger', 'Federer', dataMapper);

        assertPlayerRanking(playerRanking, 'Roger', 'Federer', 5000);
    });

    it('should update new player ranking ranking record with points on a MODIFY event', async () => {
        await playerResultsProcessorHandler(createDynamoDBStreamEvent('MODIFY', 'Roger', 'Federer'));
        await delay(100);

        const playerRanking = await getPlayerRanking('Roger', 'Federer', dataMapper);

        assertPlayerRanking(playerRanking, 'Roger', 'Federer', 1400);
    });

    it('should update new player ranking ranking record with points on a REMOVE event', async () => {
        await playerResultsProcessorHandler(createDynamoDBStreamEvent('REMOVE', 'Roger', 'Federer'));
        await delay(100);

        const playerRanking = await getPlayerRanking('Roger', 'Federer', dataMapper);

        assertPlayerRanking(playerRanking, 'Roger', 'Federer', -1600);
    });
});

const assertPlayerRanking = (playerRanking: PlayerRanking, firstName: string, lastName: string, points: number) => {
    expect(playerRanking.firstName).toBe(firstName);
    expect(playerRanking.lastName).toBe(lastName);
    expect(playerRanking.points).toBe(points);
};

const getPlayerRanking = async (
    firstName: string,
    lastName: string,
    dataMapper: DataMapper,
): Promise<PlayerRanking> => {
    const playerRanking = new PlayerRanking();
    playerRanking.firstName = firstName;
    playerRanking.lastName = lastName;
    return dataMapper.get(playerRanking);
};

const delay = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};
