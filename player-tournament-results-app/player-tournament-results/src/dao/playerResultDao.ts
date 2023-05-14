import PlayerResult from '@/model/PlayerResult';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import logger from '@/logger';
import { ConditionExpression } from '@aws/dynamodb-expressions';

export const put = (playerResult: PlayerResult, dataMapper: DataMapper): Promise<PlayerResult> => {
    logger.info(`Saving player result into DynamoDB.`);
    return dataMapper.put(playerResult);
};

export const get = (playerResult: PlayerResult, dataMapper: DataMapper): Promise<PlayerResult> => {
    logger.info(`Fetching player ${playerResult.id} from DynamoDB.`);
    return dataMapper.get(playerResult);
};

export const update = (playerResult: PlayerResult, dataMapper: DataMapper): Promise<PlayerResult> => {
    logger.info(`Update player result for player ${playerResult.id} into DynamoDB.`);
    return dataMapper.update(playerResult);
};

export const getAllPlayerResults = async (dataMapper: DataMapper): Promise<Array<PlayerResult>> => {
    const playerResults: Array<PlayerResult> = [];
    for await (const playerResult of dataMapper.scan(PlayerResult)) {
        playerResults.push(playerResult);
    }
    return playerResults;
};

export const getFilteredPlayerResults = async (
    condition: ConditionExpression,
    dataMapper: DataMapper,
): Promise<Array<PlayerResult>> => {
    const playerResults: Array<PlayerResult> = [];
    for await (const playerResult of dataMapper.scan(PlayerResult, { filter: condition })) {
        playerResults.push(playerResult);
    }
    return playerResults;
};

export const remove = (playerResultId: string, dataMapper: DataMapper): void => {
    dataMapper.delete(Object.assign(new PlayerResult(), { id: playerResultId }));
    logger.info(`Successfully deleted player result for player ${playerResultId} from DynamoDB.`);
};
