import { RESPONSE_HEADERS } from './constants';

export type QueryParameters = {
    [prop: string]: string;
};

type ApiResponse = {
    statusCode: number;
    headers: ResponseHeaders;
    body: string;
};

type ResponseHeaders = {
    [prop: string]: string;
};

export const getApiResponse = (statusCode: number, body: string): ApiResponse => {
    return {
        statusCode,
        headers: RESPONSE_HEADERS,
        body,
    };
};
