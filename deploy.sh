#!/bin/bash

echo -e "\n1. Stopping Docker containers..."
docker kill $(docker ps -q)

echo -e "\n2. Removing Docker containers..."
docker rm $(docker ps -a -q)

echo -e "\n3. Removing Images..."
docker rmi customer-service-image
docker rmi store-service-image
docker rmi front-end-image
docker rmi postgres

echo -e "\n4. Creating TastyTreats Docker Network..."
docker network create tastytreats-net

echo -e "\n5. Builing Postgres Image..."
docker pull postgres 
docker run --net tastytreats-net --name tastytreats-db -d -p 5432:5432 -e POSTGRES_PASSWORD=postgrespw postgres

echo -e "\n6. Creating Database..."
sleep 5
cd Database
pip3 install -r requirements.txt
python create_db.py

echo -e "\n7. Building Customer Service Image..."
cd ../Services/customer-service/python-flask-server
docker build -t customer-service-image .
docker run --net tastytreats-net --name customer-service-container -d -p 8080:8080 customer-service-image

echo -e "\n8. Building Store Service Image..."
cd ../../store-service/python-flask-server
docker build -t store-service-image .
docker run --net tastytreats-net --name store-service-container -d -p 8081:8081 store-service-image

echo -e "\n11. Building Front End Image..."
cd ../../../Frontend/tastytreats-app
docker build -t front-end-image .
docker run --net tastytreats-net --name front-end-container -d -p 3000:3000 front-end-image

echo -e "\nBuild Complete."
