import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerResult } from '../testUtils';
import PlayerResult from '../model/PlayerResult';
import getPlayerResults from './getPlayerResults';
import { RESPONSE_HEADERS } from '../constants';

jest.mock('@/dao/playerResultDao', () => {
    return {
        getAllPlayerResults: jest
            .fn()
            .mockImplementationOnce(() => {
                return createTestGetAllPlayerResult();
            })
            .mockImplementationOnce(() => {
                throw new Error('internal server error');
            }),
        getFilteredPlayerResults: jest
            .fn()
            .mockImplementationOnce(() => {
                return createTestFilteredPlayerResults();
            })
            .mockImplementationOnce(() => {
                throw new Error('internal server error');
            }),
    };
});

describe('test get player results handler with no query string parameters', () => {
    it('should get player result', () => {
        const result = getPlayerResults(createApiEvent('GET'), createDynamoDbDataMapper());
        expect(result).resolves.toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestGetAllPlayerResult()),
        });
    });
    it('should return 500 upon server error', () => {
        const result = getPlayerResults(createApiEvent('GET'), createDynamoDbDataMapper());
        expect(result).resolves.toEqual({
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'internal server error' }),
        });
    });
});

describe('test get player results handler with query string parameters', () => {
    it('should get player result', () => {
        const result = getPlayerResults(
            createApiEvent(
                'GET',
                '',
                {},
                {
                    firstName: 'Novak',
                    lastName: 'Djokovic',
                },
            ),
            createDynamoDbDataMapper(),
        );
        expect(result).resolves.toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestFilteredPlayerResults()),
        });
    });
    it('should return 500 upon server error', () => {
        const result = getPlayerResults(
            createApiEvent(
                'GET',
                '',
                {},
                {
                    firstName: 'Novak',
                    lastName: 'Djokovic',
                },
            ),
            createDynamoDbDataMapper(),
        );
        expect(result).resolves.toEqual({
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'internal server error' }),
        });
    });
});

const createTestGetAllPlayerResult = (): Array<PlayerResult> => {
    return [
        createPlayerResult('Roger', 'Federer', new Date('1980-02-16'), '2008 French Open', 2000),
        createPlayerResult('Rafa', 'Nadal', new Date('1986-02-07'), '2022 French Open', 5000),
    ];
};

const createTestFilteredPlayerResults = (): Array<PlayerResult> => {
    return [createPlayerResult('Novak', 'Djokovic', new Date('1987-07-07'), '2022 Australian Open', 2000)];
};
