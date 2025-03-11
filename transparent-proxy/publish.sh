#!/bin/sh

AWS_REGION=eu-west-2
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)

aws ecr get-login-password --region $AWS_REGION | sudo docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com
TAG=1.0.$(date +%s)

IMAGE=$AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/lisa/transparent-proxy:$TAG

sudo docker tag lisa/transparent-proxy $IMAGE
sudo docker push $IMAGE

echo "Revision tag: $TAG"
