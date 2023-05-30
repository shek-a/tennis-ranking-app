import { expect, describe, it, jest } from '@jest/globals';
import { createApiEvent, createDynamoDbDataMapper, createPlayerResult } from '../testUtils';
import PlayerResult from '../model/PlayerResult';
import putPlayerResult from './putPlayerResult';
import { RESPONSE_HEADERS } from '../constants';
import HttpError from '../error/HttpError';
import mapFromEventToPlayerResult from '../mapper/eventMapper';
import { put } from '../dao/playerResultDao';

jest.mock('@/mapper/eventMapper');
jest.mock('@/dao/playerResultDao');

describe('test put player result handler', () => {
    const mockedMapFromEventToPlayerResult = <jest.Mock<typeof mapFromEventToPlayerResult>>mapFromEventToPlayerResult;
    const mockedPut = <jest.Mock<typeof put>>put;

    it('should save player result', () => {
        mockedMapFromEventToPlayerResult.mockReturnValue(Promise.resolve(createTestPlayerResult()));
        mockedPut.mockReturnValue(Promise.resolve(createTestPlayerResult()));

        const result = putPlayerResult(createApiEvent('PUT'), createDynamoDbDataMapper());

        expect(result).resolves.toEqual({
            statusCode: 201,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify(createTestPlayerResult()),
        });
    });

    it('should return 400 upon client error', () => {
        mockedMapFromEventToPlayerResult.mockImplementationOnce(() => {
            throw new HttpError(400, { error: 'payload not found' });
        });

        const result = putPlayerResult(createApiEvent('PUT'), createDynamoDbDataMapper());

        expect(result).resolves.toEqual({
            statusCode: 400,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'payload not found' }),
        });
    });

    it('should return 500 upon server error', () => {
        mockedMapFromEventToPlayerResult.mockImplementationOnce(() => {
            throw new Error('internal server error');
        });

        const result = putPlayerResult(createApiEvent('PUT'), createDynamoDbDataMapper());

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
