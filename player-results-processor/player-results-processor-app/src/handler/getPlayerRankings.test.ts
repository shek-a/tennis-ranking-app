import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerRanking } from '../testUtils';
import PlayerResult from '../model/PlayerRanking';
import getPlayerRankings from './getPlayerRankings';
import { RESPONSE_HEADERS } from '../constants';

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
    it('should get player ranking', () => {
        const result = getPlayerRankings(createApiEvent('GET'), createDynamoDbDataMapper());
        expect(result).resolves.toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestGetAllPlayerRankings()),
        });
    });
    it('should return 500 upon server error', () => {
        const result = getPlayerRankings(createApiEvent('GET'), createDynamoDbDataMapper());
        expect(result).resolves.toEqual({
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'internal server error' }),
        });
    });
});

describe('test get player rankings handler with query string parameters', () => {
    it('should get player ranking', () => {
        const result = getPlayerRankings(
            createApiEvent('GET', {
                firstName: 'Novak',
                lastName: 'Djokovic',
            }),
            createDynamoDbDataMapper(),
        );
        expect(result).resolves.toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestFilteredPlayerRankings()),
        });
    });
    it('should return 500 upon server error', () => {
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
