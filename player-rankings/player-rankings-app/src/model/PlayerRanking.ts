import { table, hashKey, rangeKey, attribute } from '@aws/dynamodb-data-mapper-annotations';
import { PLAYER_RANKINGS_TABLE_NAME } from '@/constants';

@table(PLAYER_RANKINGS_TABLE_NAME)
export default class PlayerRanking {
    @hashKey()
    firstName!: string;

    @rangeKey()
    lastName!: string;

    @attribute()
    dateOfBirth!: string;

    @attribute()
    points!: number;
}
