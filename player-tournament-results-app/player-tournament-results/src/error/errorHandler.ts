import { APIGatewayProxyResult } from 'aws-lambda';
import { ValidationError } from 'yup';
import HttpError from './HttpError';
import { getApiResponse } from '@/Utils';

export default (e: unknown): APIGatewayProxyResult => {
    if (e instanceof ValidationError) {
        return getApiResponse(400, JSON.stringify({ error: e.errors }));
    } else if (e instanceof HttpError) {
        return getApiResponse(e.statusCode, e.message);
    } else {
        return getApiResponse(500, JSON.stringify({ error: 'internal server error' }));
    }
};
