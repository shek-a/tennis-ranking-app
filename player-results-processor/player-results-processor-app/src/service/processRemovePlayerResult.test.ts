import { beforeEach, expect, describe, it, jest } from '@jest/globals';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { createDynamoDBRecord, createDynamoDbDataMapper, createPlayerRanking } from '../testUtils';
import PlayerRanking from '../model/PlayerRanking';
import processRemovePlayerResult from './processRemovePlayerResult';
import { get, update } from '../dao/playerRankingDao';

jest.mock('@/dao/playerRankingDao');

describe('should process remove player result', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should substract points from the existing player result record', async () => {
        const mockedGet = <jest.Mock<typeof get>>get;
        mockedGet.mockReturnValue(Promise.resolve(createPlayerRanking('Roger', 'Federer', '1980-02-16', 20000)));
        await processRemovePlayerResult(createDynamoDBRecord('MODIFY', 'Roger', 'Federer'), createDynamoDbDataMapper());

        const playerRanking = new PlayerRanking();
        playerRanking.firstName = 'Roger';
        playerRanking.lastName = 'Federer';
        playerRanking.points = 16400;

        expect(update).toHaveBeenCalledWith(playerRanking, expect.any(DataMapper));
        expect(update).toHaveBeenCalled();
    });
});
