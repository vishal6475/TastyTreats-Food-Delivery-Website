#!/bin/bash
echo -e "\n1. Stopping Front End Container ..."
docker stop front-end-container

echo -e "\n2. Stopping Store Service Container ..."
docker stop store-service-container

echo -e "\n3. Stopping Customer Service Container ..."
docker stop customer-service-container

echo -e "\n4. Stopping Database Container ..."
docker stop tastytreats-db

docker ps
