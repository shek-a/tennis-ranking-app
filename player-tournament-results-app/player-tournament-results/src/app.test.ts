import { expect, describe, it, jest } from '@jest/globals';
import { playerResultsHandler } from './app';
import { createApiEvent } from './testUtils';
import { RESPONSE_HEADERS } from './constants';

jest.mock('@/handler/putPlayer', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return {
                statusCode: 200,
                body: 'sucess put player response',
            };
        }),
    };
});

jest.mock('@/handler/updatePlayer', () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return {
                statusCode: 200,
                body: 'sucess update player response',
            };
        }),
    };
});

describe('test player handler', () => {
    it('should call put player handler when no id path parameter is supplied', () => {
        const event = createApiEvent('PUT');

        const result = playerResultsHandler(event);
        expect(result).resolves.toEqual({
            statusCode: 200,
            body: 'sucess put player response',
        });
    });

    it('should call update player handler when id path parameter is supplied', () => {
        const event = createApiEvent('PUT', '', { id: '123' });

        const result = playerResultsHandler(event);
        expect(result).resolves.toEqual({
            statusCode: 200,
            body: 'sucess update player response',
        });
    });

    it('should return 400 upon receivng a invalid request', () => {
        const event = createApiEvent('/OPTIONS');

        const result = playerResultsHandler(event);
        expect(result).resolves.toEqual({
            statusCode: 400,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'invalid request' }),
        });
    });
});
