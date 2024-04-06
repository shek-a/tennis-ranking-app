# Player Rankings Service

The Player Rankings Service runs on AWS Lambda exposing a REST API via API Gateway allowing for the retrieval of all player results. (total number of points a tennis player has accumulated from all the tournaments he/she has entered)

### Calling the Application's API

Below are some of the sample requests:

#### Geting all player rankings
``` 
PUT <API Gateway host name>/Prod/player-rankings
```

#### Geting a player rankings by first name
``` 
PUT <API Gateway host name>/Prod/player-rankings?firstName=Roger
```

**NOTE**  
Refer to the GitHub Action workflow [Deploy Tennis Rankings Application Stack](https://github.com/shek-a/tennis-ranking-app/actions/workflows/deploy-application-stack.yaml) workflow summary for the API Gateway host name.