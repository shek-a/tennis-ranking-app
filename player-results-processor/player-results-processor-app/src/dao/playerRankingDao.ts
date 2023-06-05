import logger from '@/logger';
import PlayerRanking from '@/model/PlayerRanking';
import { DataMapper } from '@aws/dynamodb-data-mapper';

export const put = (playerRanking: PlayerRanking, dataMapper: DataMapper): Promise<PlayerRanking> => {
    logger.info(`Saving player ranking into DynamoDB.`);
    return dataMapper.put(playerRanking);
};

export const get = (playerRanking: PlayerRanking, dataMapper: DataMapper): Promise<PlayerRanking> => {
    return dataMapper.get(playerRanking);
};

export const update = (playerRanking: PlayerRanking, dataMapper: DataMapper): Promise<PlayerRanking> => {
    logger.info(`Update player rankings for player ${playerRanking.firstName} ${playerRanking.lastName}`);
    return dataMapper.update(playerRanking);
};
