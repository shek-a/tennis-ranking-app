import PlayerResult from '@/model/PlayerResult';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import logger from '@/logger';

export default (playerResult: PlayerResult, dataMapper: DataMapper): Promise<PlayerResult> => {
    logger.info(`Saving player result into DynamoDB.`);
    return dataMapper.put(playerResult);
};
