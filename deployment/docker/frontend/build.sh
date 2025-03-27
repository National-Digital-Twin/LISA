#!/bin/sh -e

cd ../../..
sudo docker build \
  --build-arg BACKEND_URL="http://localhost:3000" \
  --build-arg BACKEND_HOST="localhost:3000" \
  --build-arg NPM_TOKEN="$NPM_TOKEN" \
  -t lisa/frontend \
  -f Dockerfile.frontend \
  .
