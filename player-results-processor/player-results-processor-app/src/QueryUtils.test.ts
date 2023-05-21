import { expect, describe, it } from '@jest/globals';
import { getCondtionExpression } from './QueryUtils';

describe('Test get condition expression', () => {
    it('should get condition expression', () => {
        const queryParameter = {
            firstName: 'Novak',
            lastName: 'Djokovic',
        };

        const conditionExpression = getCondtionExpression(queryParameter);
        expect(conditionExpression).toEqual({
            type: 'And',
            conditions: [
                { type: 'Equals', object: 'Novak', subject: 'firstName' },
                { type: 'Equals', object: 'Djokovic', subject: 'lastName' },
            ],
        });
    });
});
