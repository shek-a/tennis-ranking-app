import PlayerResult from '@/model/PlayerResult';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import logger from '@/logger';

export const put = (playerResult: PlayerResult, dataMapper: DataMapper): Promise<PlayerResult> => {
    logger.info(`Saving player result into DynamoDB.`);
    return dataMapper.put(playerResult);
};

export const get = (playerResult: PlayerResult, dataMapper: DataMapper): Promise<PlayerResult> => {
    logger.info(`Fetching player ${playerResult.id} from DynamoDB.`);
    return dataMapper.get(playerResult);
};

export const update = (playerResult: PlayerResult, dataMapper: DataMapper): Promise<PlayerResult> => {
    console.dir(playerResult);
    logger.info(`Update player result for player ${playerResult.id} into DynamoDB.`);
    return dataMapper.update(playerResult);
};
