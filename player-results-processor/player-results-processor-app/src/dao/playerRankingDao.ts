import logger from '@/logger';
import PlayerRanking from '@/model/PlayerRanking';
import { DataMapper } from '@aws/dynamodb-data-mapper';

export const put = (playerResult: PlayerRanking, dataMapper: DataMapper): Promise<PlayerRanking> => {
    logger.info(`Saving player ranking into DynamoDB.`);
    return dataMapper.put(playerResult);
};

export const get = (playerRanking: PlayerRanking, dataMapper: DataMapper): Promise<PlayerRanking> => {
    return dataMapper.get(playerRanking);
};

export const update = (playerResult: PlayerRanking, dataMapper: DataMapper): Promise<PlayerRanking> => {
    logger.info(`Update player rankings for player ${playerResult.firstName} ${playerResult.lastName}`);
    return dataMapper.update(playerResult);
};
