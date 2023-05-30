import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerResult } from '../testUtils';
import PlayerResult from '../model/PlayerResult';
import updatePlayerResult from './updatePlayerResult';
import { RESPONSE_HEADERS } from '../constants';
import { createUpdatePlayerResult } from '../mapper/eventMapper';
import { get, update } from '../dao/playerResultDao';

jest.mock('@/mapper/eventMapper');
jest.mock('@/dao/playerResultDao');

describe('test update player handler', () => {
    const playerResultId = '123';
    const mockedCreateUpdatePlayerResult = <jest.Mock<typeof createUpdatePlayerResult>>createUpdatePlayerResult;
    const mockedGet = <jest.Mock<typeof get>>get;
    const mockedUpdate = <jest.Mock<typeof update>>update;

    it('should save updated player result', () => {
        mockedCreateUpdatePlayerResult.mockReturnValue(createTestPlayerResult());
        mockedGet.mockReturnValue(Promise.resolve(createTestPlayerResult()));
        mockedUpdate.mockReturnValue(Promise.resolve(createTestPlayerResult()));

        const result = updatePlayerResult(playerResultId, createApiEvent('PUT'), createDynamoDbDataMapper());

        expect(result).resolves.toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestPlayerResult()),
        });
    });

    it('should return 404 when the provided player result id is not found', async () => {
        mockedGet.mockImplementationOnce(() => {
            throw new Error('player result id not found');
        });

        const result = await updatePlayerResult(playerResultId, createApiEvent('PUT'), createDynamoDbDataMapper());

        expect(result).toEqual({
            statusCode: 404,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: `player result id ${playerResultId} not found` }),
        });
        expect(mockedCreateUpdatePlayerResult).not.toHaveBeenCalled();
        expect(mockedUpdate).not.toHaveBeenCalled();
    });

    it('should return 500 upon server error', () => {
        mockedCreateUpdatePlayerResult.mockReturnValue(createTestPlayerResult());
        mockedGet.mockReturnValue(Promise.resolve(createTestPlayerResult()));
        mockedUpdate.mockImplementationOnce(() => {
            throw new Error('internal server error');
        });

        const result = updatePlayerResult(playerResultId, createApiEvent('PUT'), createDynamoDbDataMapper());

        expect(result).resolves.toEqual({
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'internal server error' }),
        });
    });
});

const createTestPlayerResult = (): PlayerResult => {
    return createPlayerResult('Roger', 'Federer', '1980-02-16', '2008 French Open', 2000);
};
