import { APIGatewayProxyResult } from 'aws-lambda';
import HttpError from './HttpError';
import { getApiResponse } from '@/common';
import logger from '@/logger';

export default (e: unknown): APIGatewayProxyResult => {
    if (e instanceof HttpError) {
        return getApiResponse(e.statusCode, e.message);
    } else if (e instanceof Error) {
        logger.error(e.message);
        return getApiResponse(500, JSON.stringify({ error: e.message }));
    } else {
        logger.error(e);
        return getApiResponse(500, JSON.stringify({ error: 'internal server error' }));
    }
};
