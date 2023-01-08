import psycopg2
import base64
import os
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

port = 5432
host = "localhost"
user = "postgres"
password = "postgrespw"
database = 'tastytreats'
#hotels_img_dir = './img/hotels'


con = psycopg2.connect(user=user, password=password, host=host, port=port)
con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = con.cursor()
print('\nDropping Database ...')
cur.execute('DROP DATABASE IF EXISTS {}'.format(database))
print('\nCreating Database ...')
cur.execute('CREATE DATABASE {}'.format(database))
cur.close()
con.close()


con = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)
con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
cur = con.cursor()

print('\nDropping Tables ...')
cur.execute('drop TABLE IF EXISTS customers cascade;')

# Create Tables
print('\nCreating Tables ...')
cur.execute('CREATE TABLE customers (\
            id SERIAL PRIMARY KEY,\
            first_name VARCHAR(50),\
            last_name VARCHAR(50),\
            email VARCHAR(50),\
            password VARCHAR(50),\
            mobile_no VARCHAR(20),\
            location VARCHAR(50),\
            profile_pic TEXT,\
            token VARCHAR(16),\
            points float8\
            );')

cur.execute('CREATE TABLE cards(\
            id SERIAL PRIMARY KEY, \
            customer_id INT NOT NULL,\
            FOREIGN KEY (customer_id) REFERENCES customers (id),\
            customer_name VARCHAR(100),\
            card_number VARCHAR(16),\
            card_expiry VARCHAR(4),\
            primary1 VARCHAR(1)\
            );')

cur.execute('CREATE TABLE addresses(\
            id SERIAL PRIMARY KEY, \
            customer_id INT NOT NULL,\
            FOREIGN KEY (customer_id) REFERENCES customers (id),\
            unit_no TEXT,\
            addr_1 TEXT,\
            addr_2 TEXT,\
            city VARCHAR(20),\
            state VARCHAR(20),\
            pincode VARCHAR(4),\
            primary1 VARCHAR(1)\
            );')
    
    
cur.execute('CREATE TABLE hotels (\
            id SERIAL PRIMARY KEY,\
            name VARCHAR(100),\
            addr_1 VARCHAR(100),\
            addr_2 VARCHAR(100),\
            city VARCHAR(20),\
            state VARCHAR(20),\
            pincode VARCHAR(4),\
            open_time TEXT,\
            close_time TEXT,\
            delivery_fee float8,\
            min_order float8,\
            points TEXT\
            );')
    
    
cur.execute('CREATE TABLE items (\
            id SERIAL PRIMARY KEY,\
            hotel_id INT NOT NULL,\
            FOREIGN KEY (hotel_id) REFERENCES hotels (id),\
            category VARCHAR(50),\
            sequence_no INT, \
            name VARCHAR(50),\
            description VARCHAR(50),\
            price float8,\
            veg VARCHAR(1),\
            photo TEXT \
            );')

# Enter dummy data here
print('\nInserting dummy data ...')
cur.execute("INSERT INTO customers values(default, 'Vishal', 'Singh', 'vishalsingh6475@gmail.com', \
            'vish', '469717341', 'Sydney', 'pic', 'uuid', '3000'\
            );")
    

cur.execute('SELECT * FROM customers')
records = cur.fetchall()
print("\n Customer details:")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()


cur.execute('SELECT * FROM addresses')
records = cur.fetchall()
print("\n Addresses details:")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()

cur.execute('SELECT * FROM cards')
records = cur.fetchall()
print("\n Cards details:")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()    
    
    
cur.close()
con.close()