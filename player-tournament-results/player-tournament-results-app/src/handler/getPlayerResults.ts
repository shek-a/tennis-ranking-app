import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { getAllPlayerResults, getFilteredPlayerResults } from '@/dao/playerResultDao';
import errorResponse from '@/error/errorHandler';
import { QueryParameters, getApiResponse } from '@/common';
import PlayerResult from '@/model/PlayerResult';
import { getCondtionExpression } from '@/QueryUtils';

export default async (event: APIGatewayProxyEvent, dataMapper: DataMapper): Promise<APIGatewayProxyResult> => {
    try {
        const allowableQueryParameters = ['firstName', 'lastName', 'tournament'];
        const queryStringParameters: QueryParameters = {};
        allowableQueryParameters.forEach((queryParameter) => {
            if (event.queryStringParameters && event.queryStringParameters[queryParameter]) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                queryStringParameters[queryParameter] = event.queryStringParameters[queryParameter]!;
            }
        });
        let playerResults: Array<PlayerResult>;
        if (isObjectEmpty(queryStringParameters)) {
            playerResults = await getAllPlayerResults(dataMapper);
        } else {
            playerResults = await getFilteredPlayerResults(getCondtionExpression(queryStringParameters), dataMapper);
        }
        return getApiResponse(200, JSON.stringify(playerResults));
    } catch (e: unknown) {
        return errorResponse(e);
    }
};

const isObjectEmpty = (objectName: object): boolean => {
    return Object.keys(objectName).length === 0;
};
