import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerResult } from '../testUtils';
import PlayerResult from '../model/PlayerResult';
import getPlayerResults from './getPlayerResults';
import { RESPONSE_HEADERS } from '../constants';
import { getAllPlayerResults, getFilteredPlayerResults } from '../dao/playerResultDao';
import { DataMapper } from '@aws/dynamodb-data-mapper';

jest.mock('@/dao/playerResultDao');

describe('test get player results handler with no query string parameters', () => {
    const mockedGetAllPlayerResults = <jest.Mock<typeof getAllPlayerResults>>getAllPlayerResults;
    const mockedGetFilteredPlayerResults = <jest.Mock<typeof getFilteredPlayerResults>>getFilteredPlayerResults;

    it('should get player result', async () => {
        mockedGetAllPlayerResults.mockReturnValue(Promise.resolve(createTestGetAllPlayerResult()));

        const result = await getPlayerResults(createApiEvent('GET'), createDynamoDbDataMapper());

        expect(result).toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestGetAllPlayerResult()),
        });
        expect(mockedGetAllPlayerResults).toHaveBeenCalledWith(expect.any(DataMapper));
        expect(mockedGetFilteredPlayerResults).not.toHaveBeenCalled();
    });

    it('should return 500 upon server error', () => {
        mockedGetAllPlayerResults.mockImplementation(() => {
            throw new Error('internal server error');
        });

        const result = getPlayerResults(createApiEvent('GET'), createDynamoDbDataMapper());

        expect(result).resolves.toEqual({
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'internal server error' }),
        });
    });
});

describe('test get player results handler with query string parameters', () => {
    const mockedGetAllPlayerResults = <jest.Mock<typeof getAllPlayerResults>>getAllPlayerResults;
    const mockedGetFilteredPlayerResults = <jest.Mock<typeof getFilteredPlayerResults>>getFilteredPlayerResults;

    it('should get player result', async () => {
        mockedGetFilteredPlayerResults.mockReturnValue(Promise.resolve(createTestFilteredPlayerResults()));
        const result = await getPlayerResults(
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

        expect(result).toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestFilteredPlayerResults()),
        });
        expect(mockedGetFilteredPlayerResults).toHaveBeenCalled();
        expect(mockedGetAllPlayerResults).not.toHaveBeenCalled();
    });

    it('should return 500 upon server error', () => {
        mockedGetFilteredPlayerResults.mockImplementation(() => {
            throw new Error('internal server error');
        });

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
        createPlayerResult('Roger', 'Federer', '1980-02-16', '2008 French Open', 2000),
        createPlayerResult('Rafa', 'Nadal', '1986-02-07', '2022 French Open', 5000),
    ];
};

const createTestFilteredPlayerResults = (): Array<PlayerResult> => {
    return [createPlayerResult('Novak', 'Djokovic', '1987-07-07', '2022 Australian Open', 2000)];
};
