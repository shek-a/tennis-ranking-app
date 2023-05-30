import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerRanking } from '../testUtils';
import PlayerResult from '../model/PlayerRanking';
import getPlayerRankings from './getPlayerRankings';
import { RESPONSE_HEADERS } from '../constants';
import { getAllPlayerRankings, getFilteredPlayerRankings } from '../dao/playerRankingDao';
import { DataMapper } from '@aws/dynamodb-data-mapper';

jest.mock('@/dao/playerRankingDao');

jest.mock('@/dao/playerRankingDao', () => {
    return {
        getAllPlayerRankings: jest
            .fn()
            .mockImplementationOnce(() => {
                return createTestGetAllPlayerRankings();
            })
            .mockImplementationOnce(() => {
                throw new Error('internal server error');
            }),
        getFilteredPlayerRankings: jest
            .fn()
            .mockImplementationOnce(() => {
                return createTestFilteredPlayerRankings();
            })
            .mockImplementationOnce(() => {
                throw new Error('internal server error');
            }),
    };
});

describe('test get player rankings handler with no query string parameters', () => {
    const mockedGetAllPlayerRankings = <jest.Mock<typeof getAllPlayerRankings>>getAllPlayerRankings;
    const mockedGetFilteredPlayerRankings = <jest.Mock<typeof getFilteredPlayerRankings>>getFilteredPlayerRankings;

    it('should get all player rankings', async () => {
        mockedGetAllPlayerRankings.mockReturnValue(Promise.resolve(createTestGetAllPlayerRankings()));

        const result = await getPlayerRankings(createApiEvent('GET'), createDynamoDbDataMapper());

        expect(result).toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestGetAllPlayerRankings()),
        });
        expect(mockedGetAllPlayerRankings).toHaveBeenCalledWith(expect.any(DataMapper));
        expect(mockedGetFilteredPlayerRankings).not.toHaveBeenCalled();
    });

    it('should return 500 upon server error', () => {
        mockedGetAllPlayerRankings.mockImplementationOnce(() => {
            throw new Error('internal server error');
        });

        const result = getPlayerRankings(createApiEvent('GET'), createDynamoDbDataMapper());

        expect(result).resolves.toEqual({
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'internal server error' }),
        });
    });
});

describe('test get player rankings handler with query string parameters', () => {
    const mockedGetAllPlayerRankings = <jest.Mock<typeof getAllPlayerRankings>>getAllPlayerRankings;
    const mockedGetFilteredPlayerRankings = <jest.Mock<typeof getFilteredPlayerRankings>>getFilteredPlayerRankings;

    it('should get filtered player rankings', async () => {
        mockedGetFilteredPlayerRankings.mockReturnValue(Promise.resolve(createTestFilteredPlayerRankings()));

        const result = await getPlayerRankings(
            createApiEvent('GET', {
                firstName: 'Novak',
                lastName: 'Djokovic',
            }),
            createDynamoDbDataMapper(),
        );

        expect(result).toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestFilteredPlayerRankings()),
        });
        expect(mockedGetFilteredPlayerRankings).toHaveBeenCalled();
        expect(mockedGetAllPlayerRankings).not.toHaveBeenCalled();
    });

    it('should return 500 upon server error', () => {
        mockedGetFilteredPlayerRankings.mockImplementationOnce(() => {
            throw new Error('internal server error');
        });

        const result = getPlayerRankings(
            createApiEvent('GET', {
                firstName: 'Novak',
                lastName: 'Djokovic',
            }),
            createDynamoDbDataMapper(),
        );

        expect(result).resolves.toEqual({
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'internal server error' }),
        });
    });
});

const createTestGetAllPlayerRankings = (): Array<PlayerResult> => {
    return [
        createPlayerRanking('Roger', 'Federer', '1980-02-16', 2000),
        createPlayerRanking('Rafa', 'Nadal', '1986-02-07', 5000),
    ];
};

const createTestFilteredPlayerRankings = (): Array<PlayerResult> => {
    return [createPlayerRanking('Novak', 'Djokovic', '1987-07-07', 2000)];
};
