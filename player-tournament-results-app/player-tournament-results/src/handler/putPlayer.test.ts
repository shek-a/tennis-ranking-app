import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerResult } from '../testUtils';
import PlayerResult from '../model/PlayerResult';
import putPlayer from './putPlayer';
import { RESPONSE_HEADERS } from '../constants';
import HttpError from '../error/HttpError';

jest.mock('@/mapper/eventMapper', () => {
    return {
        __esModule: true,
        default: jest
            .fn()
            .mockImplementationOnce(() => {
                return createTestPlayerResult();
            })
            .mockImplementationOnce(() => {
                throw new HttpError(400, { error: 'payload not found' });
            })
            .mockImplementationOnce(() => {
                throw new Error('server error');
            }),
    };
});

jest.mock('@/dao/playerResultDao', () => {
    return {
        put: jest.fn().mockImplementationOnce(() => {
            return createTestPlayerResult();
        }),
    };
});

describe('test put player handler', () => {
    it('should save player result', () => {
        const result = putPlayer(createApiEvent('PUT'), createDynamoDbDataMapper());
        expect(result).resolves.toEqual({
            statusCode: 201,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestPlayerResult()),
        });
    });
    it('should return 400 upon client error', () => {
        const result = putPlayer(createApiEvent('PUT'), createDynamoDbDataMapper());
        expect(result).resolves.toEqual({
            statusCode: 400,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'payload not found' }),
        });
    });
    it('should return 500 upon server error', () => {
        const result = putPlayer(createApiEvent('PUT'), createDynamoDbDataMapper());
        expect(result).resolves.toEqual({
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'internal server error' }),
        });
    });
});

const createTestPlayerResult = (): PlayerResult => {
    return createPlayerResult('Roger', 'Federer', new Date('1980-02-16'), '2008 French Open', 2000);
};
