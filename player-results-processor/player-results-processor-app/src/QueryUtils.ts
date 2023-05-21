import { ConditionExpression, equals } from '@aws/dynamodb-expressions';
import { QueryParameters } from './common';

export const getCondtionExpression = (queryParameters: QueryParameters): ConditionExpression => {
    const conditions: Array<ConditionExpression> = [];

    for (const queryParameter in queryParameters) {
        const equalExpression = getEqualsExpression(queryParameter, queryParameters[queryParameter]);
        conditions.push(equalExpression);
    }

    return {
        type: 'And',
        conditions,
    };
};

const getEqualsExpression = (attributeName: string, attributeValue: string): ConditionExpression => {
    const equalsExpressionPredicate = equals(attributeValue);
    return {
        ...equalsExpressionPredicate,
        subject: attributeName,
    };
};
