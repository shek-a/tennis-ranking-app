import PlayerResult from '@/model/PlayerResult';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import logger from '@/logger';
import { QueryParameters } from '@/common';

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
    queryParameters: QueryParameters,
    dataMapper: DataMapper,
): Promise<Array<PlayerResult>> => {
    const playerResults: Array<PlayerResult> = [];
    for await (const playerResult of dataMapper.query(PlayerResult, queryParameters)) {
        playerResults.push(playerResult);
    }
    return playerResults;
};
