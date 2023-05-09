import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerResult } from '../testUtils';
import PlayerResult from '../model/PlayerResult';
import updatePlayerResult from './updatePlayerResult';
import { RESPONSE_HEADERS } from '../constants';

jest.mock('@/mapper/eventMapper', () => {
    return {
        createUpdatePlayerResult: jest.fn().mockImplementation(() => {
            return createTestPlayerResult();
        }),
    };
});

jest.mock('@/dao/playerResultDao', () => {
    return {
        update: jest
            .fn()
            .mockImplementationOnce(() => {
                return createTestPlayerResult();
            })
            .mockImplementationOnce(() => {
                throw new Error('internal server error');
            }),
        get: jest
            .fn()
            .mockImplementationOnce(() => {
                return createTestPlayerResult();
            })
            .mockImplementationOnce(() => {
                throw new Error('player result id not found');
            })
            .mockImplementationOnce(() => {
                return createTestPlayerResult();
            }),
    };
});

describe('test update player handler', () => {
    const playerResultId = '123';
    it('should save updated player result', () => {
        const result = updatePlayerResult(playerResultId, createApiEvent('PUT'), createDynamoDbDataMapper());
        expect(result).resolves.toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestPlayerResult()),
        });
    });
    it('should return 404 when the provided player result id is not found', () => {
        const result = updatePlayerResult(playerResultId, createApiEvent('PUT'), createDynamoDbDataMapper());
        expect(result).resolves.toEqual({
            statusCode: 404,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: `player result id ${playerResultId} not found` }),
        });
    });
    it('should return 500 upon server error', () => {
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
