#!/bin/sh

AWS_REGION=eu-west-2
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)

aws ecr get-login-password --region $AWS_REGION | sudo docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com
TAG=0.80.0

IMAGE=$AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/lisa_scg:$TAG

sudo docker tag scg_with_conf:$TAG $IMAGE
sudo docker push $IMAGE
