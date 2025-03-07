#!/bin/sh -e

cd ../..
sudo docker build -f deployment/docker/Dockerfile -t lisa:latest .
