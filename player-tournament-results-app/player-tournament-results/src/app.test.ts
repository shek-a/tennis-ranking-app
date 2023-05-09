import { expect, describe, it, jest } from '@jest/globals';
import { playerHandler } from './app';
import { createApiEvent } from './testUtils';

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

describe.skip('test player handler', () => {
    it('should call put player handler', () => {
        const event = createApiEvent('PUT /player-result');

        const result = playerHandler(event);
        expect(result).resolves.toEqual({
            statusCode: 200,
            body: 'sucess put player response',
        });
    });
});
