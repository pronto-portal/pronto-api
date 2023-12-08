#!/bin/sh

# Define the URL of the healthcheck route
HEALTHCHECK_URL="http://localhost:4000/healthcheck"

# Make a GET request to the healthcheck route
response=$(curl -s -o /dev/null -w "%{http_code}" $HEALTHCHECK_URL)

# Check the response code
if [ $response -eq 200 ]; then
  echo "Express server is healthy"
  exit 0
else
  echo "Express server is not healthy"
  exit 1
fi
