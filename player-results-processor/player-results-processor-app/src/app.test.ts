import { expect, describe, it, jest } from '@jest/globals';
import { playerRankingsHandler } from './app';
import { createApiEvent } from './testUtils';
import { RESPONSE_HEADERS } from './constants';

jest.mock('@/handler/getPlayerRankings', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return {
                statusCode: 200,
                body: 'success get player rankings response',
            };
        }),
    };
});

describe('test player rankings handler', () => {
    it('should call get player raking handler on a GET call', () => {
        const event = createApiEvent('GET');

        const result = playerRankingsHandler(event);
        expect(result).resolves.toEqual({
            statusCode: 200,
            body: 'success get player rankings response',
        });
    });

    it('should return 400 upon receivng a invalid request', () => {
        const event = createApiEvent('/DELETE');

        const result = playerRankingsHandler(event);
        expect(result).resolves.toEqual({
            statusCode: 400,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'invalid request' }),
        });
    });
});
