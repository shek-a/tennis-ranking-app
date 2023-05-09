import { table, attribute } from '@aws/dynamodb-data-mapper-annotations';
import { PLAYER_RESULTS_TABLE_NAME } from '@/constants';

@table(PLAYER_RESULTS_TABLE_NAME)
export default class PlayerResult {
    @attribute()
    firstName!: string;

    @attribute()
    lastName!: string;

    @attribute()
    dateOfBirth!: Date;

    @attribute()
    tournament!: string;

    @attribute()
    points!: number;
}
