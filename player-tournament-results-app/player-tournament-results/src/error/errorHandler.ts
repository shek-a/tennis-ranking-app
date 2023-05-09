import { APIGatewayProxyResult } from 'aws-lambda';
import { ValidationError } from 'yup';
import { RESPONSE_HEADERS } from '@/constants';
import HttpError from './HttpError';

export default (e: unknown): APIGatewayProxyResult => {
    if (e instanceof ValidationError) {
        return {
            statusCode: 400,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({
                errors: e.errors,
            }),
        };
    } else if (e instanceof HttpError) {
        return {
            statusCode: e.statusCode,
            headers: RESPONSE_HEADERS,
            body: e.message,
        };
    } else {
        return {
            statusCode: 500,
            headers: RESPONSE_HEADERS,
            body: JSON.stringify({ error: 'internal server error' }),
        };
    }
};
