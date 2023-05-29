import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import PlayerRanking from '@/model/PlayerRanking';
import { eventType } from './common';

export const createDynamoDBRecord = (eventName: eventType, firstName: string, lastName: string): DynamoDBRecord => {
    return {
        eventName,
        dynamodb: {
            NewImage: {
                dateOfBirth: {
                    S: '1980-02-16',
                },
                firstName: {
                    S: firstName,
                },
                lastName: {
                    S: lastName,
                },
                points: {
                    N: '3000',
                },
            },
            OldImage: {
                dateOfBirth: {
                    S: '1980-02-16',
                },
                firstName: {
                    S: firstName,
                },
                lastName: {
                    S: lastName,
                },
                points: {
                    N: '3600',
                },
            },
        },
    };
};

export const createPlayerRanking = (
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    points: number,
): PlayerRanking => {
    const playerRanking = new PlayerRanking();
    playerRanking.firstName = firstName;
    playerRanking.lastName = lastName;
    playerRanking.dateOfBirth = dateOfBirth;
    playerRanking.points = points;
    return playerRanking;
};

export const createDynamoDbDataMapper = (): DataMapper => {
    const client = new DynamoDb({ region: process.env.AWS_REGION });
    return new DataMapper({ client });
};

export const createDynamoDBStreamEvent = (
    eventName: eventType,
    firstName: string,
    lastName: string,
): DynamoDBStreamEvent => {
    return {
        Records: [createDynamoDBRecord(eventName, firstName, lastName)],
    };
};
