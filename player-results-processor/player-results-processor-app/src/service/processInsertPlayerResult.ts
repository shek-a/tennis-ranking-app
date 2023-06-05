import { get, put, update } from '@/dao/playerRankingDao';

import logger from '@/logger';
import PlayerRanking from '@/model/PlayerRanking';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDBRecord } from 'aws-lambda';

export default async (record: DynamoDBRecord, dataMapper: DataMapper): Promise<void> => {
    const firstName = record.dynamodb?.NewImage?.firstName.S;
    const lastName = record.dynamodb?.NewImage?.lastName.S;
    const dateOfBirth = record.dynamodb?.NewImage?.dateOfBirth.S;
    const points = record.dynamodb?.NewImage?.points.N;

    if (firstName && lastName && dateOfBirth && points) {
        await processInsertPlayerResult(firstName, lastName, dateOfBirth, +points, dataMapper);
    } else {
        logger.error(`error processing DynamoDB record ${record.eventID}`);
    }
};

const processInsertPlayerResult = async (
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    points: number,
    dataMapper: DataMapper,
): Promise<void> => {
    let playerRanking = new PlayerRanking();
    playerRanking.firstName = firstName;
    playerRanking.lastName = lastName;
    console.log('processInsertPlayerResult function');
    try {
        playerRanking = await get(playerRanking, dataMapper);
        console.log('get player ranking success');
        console.log(playerRanking);
    } catch (e: unknown) {
        logger.info(`inserting player ranking record for ${firstName} ${lastName}`);
        await addPlayerRanking(firstName, lastName, dateOfBirth, points, dataMapper);
        return;
    }

    try {
        const currentPoints = playerRanking.points;
        const newTotalPoints = currentPoints + points;
        logger.info(`Adding ${points} points for player ${playerRanking.firstName} ${playerRanking.lastName}`);

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

const addPlayerRanking = async (
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    points: number,
    dataMapper: DataMapper,
): Promise<void> => {
    const playerRanking = new PlayerRanking();
    playerRanking.firstName = firstName;
    playerRanking.lastName = lastName;
    playerRanking.dateOfBirth = dateOfBirth;
    playerRanking.points = points;

    try {
        await put(playerRanking, dataMapper);
    } catch (e: unknown) {
        logger.error(`error inserting player record for ${firstName} ${lastName}`);
    }
};
