# Tennis Rankings Application

The tennis rankings Application calculates a tennis player's total points based on the points won at tournaments he/she has participated in.

It consists of 3 core components:
- [Player Tournament Results Service](/player-tournament-results/README.md)
- [Player Results Processor Service](/player-results-processor/README.md)
- [Player Rankings Service](/player-rankings/README.md)


# Architecture
![Tennis Rankings App](/images/tennis_rankings_app_architecture.jpg)


# Deploying the Application Stack

A GitHub Action workflow [Deploy Tennis Rankings Application Stack](https://github.com/shek-a/tennis-ranking-app/actions/workflows/deploy-application-stack.yaml) is used to deploy the following CloudFormation Stacks:
- player-tournament-results
- player-results-processor
- player-rankings

## Prerequisites

### AWS 
Create an S3 bucket.  This will contain the AWS Lambda binaries to deploy.

### GitHub Action Secrets and variables

#### Secrets

The following GitHub Action Secrets are required:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
  
![GitHub Actions Secrets](/images/github_actions_secrets.png)
This is the access key of the IAM role/user that has the appropriate permissions to deploy the application's CloudFormation Stack.
  
#### Variables

The following GitHub Action Variables are required:
- AWS_REGION
  
![GitHub Actions Environment Varibles](/images/github_actions_environment_variables.png)
This is the AWS Region the application will be deployed to.

## Deploying the application using GitHub Actions workflow 

#### Running the deployment GitHub Actions workflow
The [Deploy Tennis Rankings Application Stack](https://github.com/shek-a/tennis-ranking-app/actions/workflows/deploy-application-stack.yaml) is used to deploy the application.

![Deployment GitHub Action workflow](/images//deployment_github_action_workflow.png)
The name of the S3 bucket created for storing the AWS Lambda binaries is a Workflow input.

#### Getting the API URLs
Upon Succesful deployment of the application stack, the 3 GitHub Actions WorkFlow Jobs (1 Job for each CloudFormation Stack deployment) will be successful as shown in the workflow summary.

![Successful Application Deployment](/images//successful_application_deployment.png)


The URLs for the [Player Tournament Results Service](/player-tournament-results/README.md) and [Player Rankings Service](/player-rankings/README.md) APIs can also be found in the workflow summary.

![API URLS](/images/api_urls.png)