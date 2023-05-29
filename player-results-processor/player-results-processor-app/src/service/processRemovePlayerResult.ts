import { get, update } from '@/dao/playerRankingDao';

import logger from '@/logger';
import PlayerRanking from '@/model/PlayerRanking';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDBRecord } from 'aws-lambda';

export default (record: DynamoDBRecord, dataMapper: DataMapper): void => {
    const firstName = record.dynamodb?.OldImage?.firstName.S;
    const lastName = record.dynamodb?.OldImage?.lastName.S;
    const pointsToRemove = record.dynamodb?.OldImage?.points.N;

    if (firstName && lastName && pointsToRemove) {
        processRemovePlayerResult(firstName, lastName, +pointsToRemove, dataMapper);
    } else {
        logger.error(`error processing DynamoDB record ${record.eventID}`);
    }
};

const processRemovePlayerResult = async (
    firstName: string,
    lastName: string,
    pointsToRemove: number,
    dataMapper: DataMapper,
): Promise<void> => {
    let playerRanking = new PlayerRanking();
    playerRanking.firstName = firstName;
    playerRanking.lastName = lastName;

    try {
        playerRanking = await get(playerRanking, dataMapper);
        const currentTotalPoints = playerRanking.points;
        const newTotalPoints = currentTotalPoints - pointsToRemove;
        logger.info(
            `Removing ${pointsToRemove} points for player ${playerRanking.firstName} ${playerRanking.lastName}`,
        );

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
