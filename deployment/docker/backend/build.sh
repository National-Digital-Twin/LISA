#!/bin/sh -e

cd ../../..
sudo docker build -f Dockerfile.backend -t lisa/backend:latest .
