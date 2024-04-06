# Player Results Processor Service

The Player Results Processor Service runs on AWS Lambda listening to DynamoDB Streams on the Payer Tournament Results DynamoDB Table.  Based on the DynamoDB change stream event, it calculates the total number of points a tennis player has accumulated from all the tournaments he/she has entered and then add/updates the player's record in the Player Rankings DynamoDB Table.
