#!/bin/sh -e

cd ..

sudo docker build -f scg-with-config/Dockerfile --platform linux/amd64/v2 -t scg_with_conf:0.80.0 .
