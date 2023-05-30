import { expect, describe, it } from '@jest/globals';
import { ValidationError } from 'yup';
import { createApiEvent, createPlayerResult } from '../testUtils';
import eventMapper, { createUpdatePlayerResult } from './eventMapper';

describe('test event to player result mapping', () => {
    it('should map api gateway event to a player result', () => {
        const apiPutPlayerResultEvent = createApiEvent('PUT', createPlayerResultBody());
        const result = eventMapper(apiPutPlayerResultEvent);

        expect(result).resolves.toEqual(createPlayerResult('Roger', 'Federer', '1980-02-16', '2008 French Open', 3000));
    });

    it('should throw a yup validation exception when player result fields are missing', () => {
        const apiPutPlayerResultEvent = createApiEvent('PUT', createPlayerInvalidResultBody());

        expect(eventMapper(apiPutPlayerResultEvent)).rejects.toThrow(ValidationError);
    });

    it('should throw a 400 Http error when an invalid date is provided', () => {
        const apiPutPlayerResultEvent = createApiEvent('PUT', createInvalidDatePlayerResultBody());

        expect(eventMapper(apiPutPlayerResultEvent)).rejects.toThrow(
            JSON.stringify({ error: 'invalid date provided' }),
        );
    });
});

describe('test update event to player result mapping', () => {
    it('should add a single api gateway update event attribute to a player result', () => {
        const existingPlayerResult = createPlayerResult('Roger', 'Federer', '1980-02-16', '2008 French Open', 3000);
        const apiUpdatePlayerResultEvent = createApiEvent(
            'PUT',
            JSON.stringify({
                id: '123',
                points: 5000,
            }),
        );
        const result = createUpdatePlayerResult(existingPlayerResult, apiUpdatePlayerResultEvent);

        expect(result).toEqual(createPlayerResult('Roger', 'Federer', '1980-02-16', '2008 French Open', 5000));
    });

    it('should add multiple api gateway update event attributes to a player result', () => {
        const existingPlayerResult = createPlayerResult('Roger', 'Federer', '1980-02-16', '2008 French Open', 3000);
        const apiUpdatePlayerResultEvent = createApiEvent(
            'PUT',
            JSON.stringify({
                id: '123',
                invalidAttribute: 'test',
                points: 5000,
                tournament: '2009 Wimbledon',
            }),
        );
        const result = createUpdatePlayerResult(existingPlayerResult, apiUpdatePlayerResultEvent);

        expect(result).toEqual(createPlayerResult('Roger', 'Federer', '1980-02-16', '2009 Wimbledon', 5000));
    });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createPlayerResultBody = (): any => {
    const playerResultBody = {
        firstName: 'Roger',
        lastName: 'Federer',
        dateOfBirth: '1980-02-16',
        tournament: '2008 French Open',
        points: 3000,
        invalid: 8999,
    };

    return JSON.stringify(playerResultBody);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createPlayerInvalidResultBody = (): any => {
    const playerResultBody = {
        firstName: 'Roger',
        lastName: 'Federer',
        dateOfBirth: '1980-02-16',
        points: 3000,
    };

    return JSON.stringify(playerResultBody);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createInvalidDatePlayerResultBody = (): any => {
    const playerResultBody = {
        firstName: 'Roger',
        lastName: 'Federer',
        dateOfBirth: '1980-14-16',
        tournament: '2008 French Open',
        points: 3000,
    };

    return JSON.stringify(playerResultBody);
};
