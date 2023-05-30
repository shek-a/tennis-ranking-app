import { expect, describe, it, jest } from '@jest/globals';
import { DataMapper, ItemNotFoundException } from '@aws/dynamodb-data-mapper';
import { createDynamoDBRecord, createDynamoDbDataMapper, createPlayerRanking } from '../testUtils';
import PlayerRanking from '../model/PlayerRanking';
import processInsertPlayerResult from './processInsertPlayerResult';
import { get, update, put } from '../dao/playerRankingDao';

jest.mock('@/dao/playerRankingDao');

describe('should process insert player result', () => {
    const mockedGet = <jest.Mock<typeof get>>get;

    it('should update existing player result record when player result is found', async () => {
        mockedGet.mockReturnValue(Promise.resolve(createPlayerRanking('Roger', 'Federer', '1980-02-16', 10000)));
        await processInsertPlayerResult(createDynamoDBRecord('INSERT', 'Roger', 'Federer'), createDynamoDbDataMapper());

        const playerRanking = new PlayerRanking();
        playerRanking.firstName = 'Roger';
        playerRanking.lastName = 'Federer';
        playerRanking.points = 13000;

        expect(update).toHaveBeenCalledWith(playerRanking, expect.any(DataMapper));
        expect(update).toHaveBeenCalled();
        expect(put).not.toHaveBeenCalled();
    });

    it('should create existing player result record when player result is not found', async () => {
        mockedGet.mockImplementation(() => {
            throw ItemNotFoundException;
        });
        await processInsertPlayerResult(createDynamoDBRecord('INSERT', 'Roger', 'Federer'), createDynamoDbDataMapper());

        const playerRanking = new PlayerRanking();
        playerRanking.dateOfBirth = '1980-02-16';
        playerRanking.firstName = 'Roger';
        playerRanking.lastName = 'Federer';
        playerRanking.points = 3000;

        expect(put).toHaveBeenCalledWith(playerRanking, expect.any(DataMapper));
        expect(update).not.toHaveBeenCalled();
    });
});
