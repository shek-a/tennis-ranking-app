import { expect, describe, it, jest } from '@jest/globals';
import { playerResultsProcessorHandler } from './app';
import { createDynamoDBStreamEvent } from './testUtils';
import processInsertPlayerResult from './service/processInsertPlayerResult';
import processModifyPlayerResult from './service/processModifyPlayerResult';
import processRemovePlayerResult from './service/processRemovePlayerResult';

jest.mock('@/service/processInsertPlayerResult');
jest.mock('@/service/processModifyPlayerResult');
jest.mock('@/service/processRemovePlayerResult');

describe('test player results processor handler', () => {
    it('should call process insert player result service on a INSERT event', async () => {
        await playerResultsProcessorHandler(createDynamoDBStreamEvent('INSERT', 'Roger', 'Federer'));
        expect(processInsertPlayerResult).toHaveBeenCalled();
    });

    it('should call process modify player result service on a MODIFY event', async () => {
        await playerResultsProcessorHandler(createDynamoDBStreamEvent('MODIFY', 'Roger', 'Federer'));
        expect(processModifyPlayerResult).toHaveBeenCalled();
    });

    it('should call process remove player result service on a REMOVE event', async () => {
        await playerResultsProcessorHandler(createDynamoDBStreamEvent('REMOVE', 'Roger', 'Federer'));
        expect(processRemovePlayerResult).toHaveBeenCalled();
    });
});
