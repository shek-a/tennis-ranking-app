import { APIGatewayProxyEvent } from 'aws-lambda';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import PlayerResult from '@/model/PlayerResult';

export const createApiEvent = (path: string, body = 'test'): APIGatewayProxyEvent => {
    return {
        httpMethod: '',
        body: body,
        headers: {},
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path,
        pathParameters: {},
        queryStringParameters: {},
        requestContext: {
            accountId: '123456789012',
            apiId: '1234',
            authorizer: {},
            httpMethod: 'get',
            identity: {
                accessKey: '',
                accountId: '',
                apiKey: '',
                apiKeyId: '',
                caller: '',
                clientCert: {
                    clientCertPem: '',
                    issuerDN: '',
                    serialNumber: '',
                    subjectDN: '',
                    validity: { notAfter: '', notBefore: '' },
                },
                cognitoAuthenticationProvider: '',
                cognitoAuthenticationType: '',
                cognitoIdentityId: '',
                cognitoIdentityPoolId: '',
                principalOrgId: '',
                sourceIp: '',
                user: '',
                userAgent: '',
                userArn: '',
            },
            path: '/hello',
            protocol: 'HTTP/1.1',
            requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
            requestTimeEpoch: 1428582896000,
            resourceId: '123456',
            resourcePath: '/hello',
            stage: 'dev',
        },
        resource: '',
        stageVariables: {},
    };
};

export const createPlayerResult = (
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    tournament: string,
    points: number,
): PlayerResult => {
    const playerResult = new PlayerResult();
    playerResult.firstName = firstName;
    playerResult.lastName = lastName;
    playerResult.dateOfBirth = dateOfBirth;
    playerResult.tournament = tournament;
    playerResult.points = points;
    return playerResult;
};

export const createDynamoDbDataMapper = (): DataMapper => {
    const client = new DynamoDb({ region: process.env.AWS_REGION });
    return new DataMapper({ client });
};
