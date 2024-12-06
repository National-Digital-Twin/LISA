#!/bin/sh -e

cd ../..
sudo docker build -f deployment/docker/Dockerfile -t c477:latest .
