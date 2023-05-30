import { expect, describe, it, jest } from '@jest/globals';
import { playerResultsHandler } from './app';
import { createApiEvent } from './testUtils';
import { RESPONSE_HEADERS } from './constants';
import getPlayerResultsHandler from './handler/getPlayerResults';
import putPlayerResultHandler from './handler/putPlayerResult';
import removePlayerResultHandler from './handler/removePlayerResult';
import updateResultPlayerHandler from './handler/updatePlayerResult';

jest.mock('@/handler/getPlayerResults');
jest.mock('@/handler/putPlayerResult');
jest.mock('@/handler/removePlayerResult');
jest.mock('@/handler/updatePlayerResult');

describe('test player results handler', () => {
    it('should call put player results handler when no id path parameter is supplied on a PUT call', async () => {
        const mockedPutPlayerResultHandler = <jest.Mock<typeof putPlayerResultHandler>>putPlayerResultHandler;
        mockedPutPlayerResultHandler.mockReturnValue(
            Promise.resolve({
                statusCode: 200,
                body: 'success put player response',
            }),
        );
        const event = createApiEvent('PUT');

        const result = await playerResultsHandler(event);

        expect(result).toEqual({
            statusCode: 200,
            body: 'success put player response',
        });
        expect(mockedPutPlayerResultHandler).toHaveBeenCalled();
    });

    it('should call update player results handler when a id path parameter is supplied on a PUT call', async () => {
        const mockedUpdatePlayerResultHandler = <jest.Mock<typeof updateResultPlayerHandler>>updateResultPlayerHandler;
        mockedUpdatePlayerResultHandler.mockReturnValue(
            Promise.resolve({
                statusCode: 200,
                body: 'success update player response',
            }),
        );
        const event = createApiEvent('PUT', '', { id: '123' });

        const result = await playerResultsHandler(event);

        expect(result).toEqual({
            statusCode: 200,
            body: 'success update player response',
        });
        expect(mockedUpdatePlayerResultHandler).toHaveBeenCalled();
    });

    it('should call get player results handler on a GET call', async () => {
        const mockedGetPlayerResultHandler = <jest.Mock<typeof getPlayerResultsHandler>>getPlayerResultsHandler;
        mockedGetPlayerResultHandler.mockReturnValue(
            Promise.resolve({
                statusCode: 200,
                body: 'success get player response',
            }),
        );
        const event = createApiEvent('GET');

        const result = await playerResultsHandler(event);

        expect(result).toEqual({
            statusCode: 200,
            body: 'success get player response',
        });
        expect(mockedGetPlayerResultHandler).toHaveBeenCalled();
    });

    it('should call remove player results handler when a id path parameter is supplied on a DELETE call', async () => {
        const mockedRemovePlayerResultHandler = <jest.Mock<typeof removePlayerResultHandler>>removePlayerResultHandler;
        mockedRemovePlayerResultHandler.mockReturnValue(
            Promise.resolve({
                statusCode: 200,
                body: 'success remove player response',
            }),
        );
        const event = createApiEvent('DELETE');

        const result = await playerResultsHandler(event);

        expect(result).toEqual({
            statusCode: 200,
            body: 'success remove player response',
        });
        expect(mockedRemovePlayerResultHandler).toHaveBeenCalled();
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
