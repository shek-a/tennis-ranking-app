import { expect, describe, it } from '@jest/globals';
import { ValidationError } from 'yup';
import { createApiEvent, createPlayerResult } from '../testUtils';
import eventMapper from './eventMapper';

describe('test event to player result mapping', () => {
    it('should map api gateway event to a player result', () => {
        const apiPutPlayerResultEvent = createApiEvent('PUT /player-result', createPlayerResultBody());
        const result = eventMapper(apiPutPlayerResultEvent);
        expect(result).resolves.toEqual(
            createPlayerResult('Roger', 'Federer', new Date('1980-02-16'), '2008 French Open', 3000),
        );
    });

    it('should throw a yup validation exception when player result fields are missing', () => {
        const apiPutPlayerResultEvent = createApiEvent('PUT /player-result', createPlayerInvalidResultBody());
        expect(eventMapper(apiPutPlayerResultEvent)).rejects.toThrow(ValidationError);
    });

    it('should throw a 400 Http error when an invalid date is provided', () => {
        const apiPutPlayerResultEvent = createApiEvent('PUT /player-result', createInvalidDatePlayerResultBody());
        expect(eventMapper(apiPutPlayerResultEvent)).rejects.toThrow(
            JSON.stringify({ error: 'invalid date provided' }),
        );
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
