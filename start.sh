#!/bin/bash

echo -e "\n1. Starting Database Container ..."
docker start tastytreats-db

echo -e "\n2. Starting Customer Service Container ..."
docker start customer-service-container

echo -e "\n3. Starting Store Service Container ..."
docker start store-service-container

echo -e "\n4. Starting Front End Container ..."
docker start front-end-container

docker ps
