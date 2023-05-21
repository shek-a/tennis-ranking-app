import { table, hashKey, rangeKey, attribute } from '@aws/dynamodb-data-mapper-annotations';
import { PLAYER_RANKINGS_TABLE_NAME } from '@/constants';

@table(PLAYER_RANKINGS_TABLE_NAME)
export default class PlayerRanking {
    @hashKey({ type: 'String' })
    firstName!: string;

    @rangeKey({ type: 'String' })
    lastName!: string;

    @attribute()
    dateOfBirth!: string;

    @attribute()
    points!: number;
}