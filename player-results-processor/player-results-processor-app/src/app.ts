import { DynamoDBStreamEvent } from 'aws-lambda';
import logger from './logger';
// import DynamoDb from 'aws-sdk/clients/dynamodb';
// import { DataMapper } from '@aws/dynamodb-data-mapper';
// import { getApiResponse } from './common';

export const playerResultsProcessorHandler = async (event: DynamoDBStreamEvent) => {
    try {
        event.Records.map((record) => {
            logger.info('incoming stream');
            logger.info(record);
        });
        return;
    } catch (error) {
        console.log('error', error);
        return;
    }
};

// const getDynamoDbClient = (): DynamoDb => {
//     return process.env.DYNAMODB_ENDPOINT
//         ? new DynamoDb({ endpoint: process.env.DYNAMODB_ENDPOINT, region: 'ap-southeast-2' })
//         : new DynamoDb({ region: process.env.AWS_REGION });
// };
