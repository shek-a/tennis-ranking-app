import { APIGatewayProxyEvent } from 'aws-lambda';
import DynamoDb from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import PlayerRanking from '@/model/PlayerRanking';

export const createApiEvent = (httpMethod: string, queryStringParameters = {}): APIGatewayProxyEvent => {
    return {
        httpMethod,
        body: '',
        headers: {},
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: '',
        pathParameters: {},
        queryStringParameters,
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
