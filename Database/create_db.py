import psycopg2
import base64
import os
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

port = 5432
host = "localhost"
user = "postgres"
password = "vishal26"
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
            mobile_no VARCHAR(20),\
            location VARCHAR(50),\
            password VARCHAR(50),\
            profile_pic TEXT,\
            points VARCHAR(30)\
            );')

cur.execute('CREATE TABLE cards(\
            id SERIAL PRIMARY KEY, \
            customer_id INT NOT NULL,\
            FOREIGN KEY (customer_id) REFERENCES customers (id),\
            card_number VARCHAR(16),\
            card_expiry VARCHAR(4)\
            );')

# Enter dummy data here
print('\nInserting dummy data ...')
cur.execute("INSERT INTO customers values(default, 'Vishal', 'Singh', 'vishalsingh6475@gmail.com', \
            '469717341', 'Sydney', 'Vish', 'uuid', '3000'\
            );")
    

cur.execute('SELECT * FROM customers')
records = cur.fetchall()
print("\n Customer details:")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()
    
    
cur.close()
con.close()