import PlayerRanking from '@/model/PlayerRanking';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { ConditionExpression } from '@aws/dynamodb-expressions';

export const getAllPlayerRankings = async (dataMapper: DataMapper): Promise<Array<PlayerRanking>> => {
    const playerRankings: Array<PlayerRanking> = [];
    for await (const playerRanking of dataMapper.scan(PlayerRanking)) {
        playerRankings.push(playerRanking);
    }
    return playerRankings;
};

export const getFilteredPlayerRankings = async (
    condition: ConditionExpression,
    dataMapper: DataMapper,
): Promise<Array<PlayerRanking>> => {
    const playerRankings: Array<PlayerRanking> = [];
    for await (const playerRanking of dataMapper.scan(PlayerRanking, { filter: condition })) {
        playerRankings.push(playerRanking);
    }
    return playerRankings;
};
