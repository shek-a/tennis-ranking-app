import { beforeEach, expect, describe, it, jest } from '@jest/globals';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { createDynamoDBRecord, createDynamoDbDataMapper, createPlayerRanking } from '../testUtils';
import PlayerRanking from '../model/PlayerRanking';
import processModifyPlayerResult from './processModifyPlayerResult';
import { get, update } from '../dao/playerRankingDao';

jest.mock('@/dao/playerRankingDao');

describe('should process modify player result', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should update existing player result record with the updated points', async () => {
        const mockedGet = <jest.Mock<typeof get>>get;
        mockedGet.mockReturnValue(Promise.resolve(createPlayerRanking('Roger', 'Federer', '1980-02-16', 20000)));
        await processModifyPlayerResult(createDynamoDBRecord('MODIFY', 'Roger', 'Federer'), createDynamoDbDataMapper());

        const playerRanking = new PlayerRanking();
        playerRanking.firstName = 'Roger';
        playerRanking.lastName = 'Federer';
        playerRanking.points = 19400;

        expect(update).toHaveBeenCalledWith(playerRanking, expect.any(DataMapper));
        expect(update).toHaveBeenCalled();
    });
});
