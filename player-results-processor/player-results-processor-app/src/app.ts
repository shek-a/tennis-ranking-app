import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import processInsertPlayerResult from '@/service/processInsertPlayerResult';
import processModifyPlayerResult from '@/service/processModifyPlayerResult';
import processRemovePlayerResult from '@/service/processRemovePlayerResult';
import logger from './logger';

export const playerResultsProcessorHandler = async (event: DynamoDBStreamEvent) => {
    const client = getDynamoDbClient();
    const mapper = new DataMapper({ client });

    event.Records.forEach((record) => processResultRecord(record, mapper));
};

const processResultRecord = (record: DynamoDBRecord, dataMapper: DataMapper): void => {
    switch (record.eventName) {
        case 'INSERT':
            processInsertPlayerResult(record, dataMapper);
            break;
        case 'MODIFY':
            processModifyPlayerResult(record, dataMapper);
            break;
        case 'REMOVE':
            processRemovePlayerResult(record, dataMapper);
            break;
        default:
            logger.error(`error processing DynamoDB record ${record.eventID}`);
    }
};

const getDynamoDbClient = (): DynamoDb => {
    return process.env.DYNAMODB_ENDPOINT
        ? new DynamoDb({ endpoint: process.env.DYNAMODB_ENDPOINT, region: 'ap-southeast-2' })
        : new DynamoDb({ region: process.env.AWS_REGION });
};
