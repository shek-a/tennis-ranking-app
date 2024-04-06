# Player Tournament Results Service

The Player Tournament Results Service runs on AWS Lambda exposing REST APIs via API Gateway allowing tennis players to submit the points earned from tournaments they have entered.  The records are stored in DynamoDB. 

### Calling the Application's API

Below are some of the sample requests:

#### Submitting a player result
``` 
PUT <API Gateway host name>/Prod/player-result
{
    "firstName": "Roger",
    "lastName": "Federer",
    "dateOfBirth": "1980-02-16",
    "tournament": "2015 Madrid",
    "points": 1000
}
```

#### Get all player results
```
GET <API Gateway host name>/Prod/player-result
```

#### Get all player results by first name
```
GET <API Gateway host name>/Prod/player-result?firstName=Rafa
```

#### Delete player result
```
GET <API Gateway host name>/Prod/player-result/{player-id}
```
