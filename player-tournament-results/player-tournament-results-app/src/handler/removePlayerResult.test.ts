import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerResult } from '../testUtils';
import PlayerResult from '../model/PlayerResult';
import removePlayerResult from './removePlayerResult';
import { RESPONSE_HEADERS } from '../constants';
import HttpError from '../error/HttpError';

jest.mock('@/dao/playerResultDao', () => {
    return {
        remove: jest
            .fn()
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            .mockImplementationOnce(() => {})
            .mockImplementationOnce(() => {
                throw new HttpError(500, { error: `unable to remove player result id 123` });
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

describe('test remove player result handler', () => {
    const playerResultId = '123';
    it('should remove player result', () => {
        const result = removePlayerResult(
            createApiEvent('DELETE', '', { id: playerResultId }),
            createDynamoDbDataMapper(),
        );
        expect(result).resolves.toEqual({
            statusCode: 200,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ message: `player result id 123 removed` }),
        });
    });
    it('should return 404 when the provided player result id is not found', () => {
        const result = removePlayerResult(
            createApiEvent('DELETE', '', { id: playerResultId }),
            createDynamoDbDataMapper(),
        );
        expect(result).resolves.toEqual({
            statusCode: 404,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: `player result id ${playerResultId} not found` }),
        });
    });
    it('should return 500 upon server error', () => {
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
