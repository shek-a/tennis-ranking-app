import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerResult } from '../testUtils';
import PlayerResult from '../model/PlayerResult';
import removePlayerResult from './removePlayerResult';
import { RESPONSE_HEADERS } from '../constants';
import HttpError from '../error/HttpError';
import { get, remove } from '../dao/playerResultDao';
import { DataMapper } from '@aws/dynamodb-data-mapper';

jest.mock('@/dao/playerResultDao');

describe('test remove player result handler', () => {
    const playerResultId = '123';
    const mockedGet = <jest.Mock<typeof get>>get;
    const mockedRemove = <jest.Mock<typeof remove>>remove;

    it('should remove player result', async () => {
        mockedGet.mockReturnValue(Promise.resolve(createTestPlayerResult()));

        const result = await removePlayerResult(
            createApiEvent('DELETE', '', { id: playerResultId }),
            createDynamoDbDataMapper(),
        );

        expect(result).toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ message: `player result id 123 removed` }),
        });
        expect(mockedRemove).toBeCalledWith('123', expect.any(DataMapper));
    });

    it('should return 404 when the provided player result id is not found', async () => {
        mockedGet.mockImplementationOnce(() => {
            throw new Error('player result id not found');
        });

        const result = await removePlayerResult(
            createApiEvent('DELETE', '', { id: playerResultId }),
            createDynamoDbDataMapper(),
        );

        expect(result).toEqual({
            statusCode: 404,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: `player result id ${playerResultId} not found` }),
        });
        expect(mockedRemove).not.toHaveBeenCalled();
    });

    it('should return 500 upon server error', () => {
        mockedGet.mockReturnValue(Promise.resolve(createTestPlayerResult()));
        mockedRemove.mockImplementationOnce(() => {
            throw new HttpError(500, { error: `unable to remove player result id 123` });
        });

        const result = removePlayerResult(
            createApiEvent('DELETE', '', { id: playerResultId }),
            createDynamoDbDataMapper(),
        );
        expect(result).resolves.toEqual({
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'unable to remove player result id 123' }),
        });
    });
});

const createTestPlayerResult = (): PlayerResult => {
    return createPlayerResult('Roger', 'Federer', '1980-02-16', '2008 French Open', 2000);
};
