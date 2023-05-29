import { get, update } from '@/dao/playerRankingDao';

import logger from '@/logger';
import PlayerRanking from '@/model/PlayerRanking';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDBRecord } from 'aws-lambda';

export default (record: DynamoDBRecord, dataMapper: DataMapper): void => {
    const firstName = record.dynamodb?.NewImage?.firstName.S;
    const lastName = record.dynamodb?.NewImage?.lastName.S;
    const updatedPoints = record.dynamodb?.NewImage?.points.N;
    const currentPoints = record.dynamodb?.OldImage?.points.N;

    if (firstName && lastName && updatedPoints && currentPoints) {
        processModifyPlayerResult(firstName, lastName, +updatedPoints, +currentPoints, dataMapper);
    } else {
        logger.error(`error processing DynamoDB record ${record.eventID}`);
    }
};

const processModifyPlayerResult = async (
    firstName: string,
    lastName: string,
    updatedPoints: number,
    currentPoints: number,
    dataMapper: DataMapper,
): Promise<void> => {
    let playerRanking = new PlayerRanking();
    playerRanking.firstName = firstName;
    playerRanking.lastName = lastName;

    try {
        playerRanking = await get(playerRanking, dataMapper);
        const currentTotalPoints = playerRanking.points;
        const newTotalPoints = currentTotalPoints + (updatedPoints - currentPoints);
        logger.info(`Adding ${newTotalPoints} points for player ${playerRanking.firstName} ${playerRanking.lastName}`);

        const updatedPlayerRanking = Object.assign(new PlayerRanking(), {
            firstName,
            lastName,
            points: newTotalPoints,
        });
        await update(updatedPlayerRanking, dataMapper);
    } catch (e: unknown) {
        logger.error(e);
    }
};
