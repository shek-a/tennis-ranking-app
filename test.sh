APP_NAME=player-tournament-results-app-api-url
URL=$(aws cloudformation list-exports --query "Exports[?Name=='$APP_NAME'].Value" --output text)
echo $URL