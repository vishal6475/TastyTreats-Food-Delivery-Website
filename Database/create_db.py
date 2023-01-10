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
    
    
cur.execute('CREATE TABLE stores (\
            id SERIAL PRIMARY KEY,\
            name VARCHAR(100),\
            addr_1 TEXT,\
            addr_2 TEXT,\
            city VARCHAR(20),\
            state VARCHAR(20),\
            pincode VARCHAR(4),\
            types TEXT,\
            open VARCHAR(4),\
            close VARCHAR(4),\
            delivery VARCHAR(1),\
            delivery_fee float8,\
            min_order float8,\
            photo TEXT\
            );')
    
    
cur.execute('CREATE TABLE categories (\
            id SERIAL PRIMARY KEY,\
            store_id INT NOT NULL,\
            FOREIGN KEY (store_id) REFERENCES stores (id),\
            category TEXT NOT NULL,\
            display_sequence INT NOT NULL\
            );')
    
    
cur.execute('CREATE TABLE items (\
            id SERIAL PRIMARY KEY,\
            category_id INT NOT NULL,\
            FOREIGN KEY (category_id) REFERENCES categories (id),\
            name VARCHAR(100) NOT NULL,\
            description VARCHAR(300),\
            price float8 NOT NULL,\
            veg INT NOT NULL,\
            status INT NOT NULL,\
            photo TEXT \
            );')
    
    
cur.execute('CREATE TABLE orders (\
            id SERIAL PRIMARY KEY,\
            customer_id INT NOT NULL,\
            FOREIGN KEY (customer_id) REFERENCES customers (id),\
            store_id INT NOT NULL,\
            FOREIGN KEY (store_id) REFERENCES stores (id),\
            date VARCHAR(25) NOT NULL,\
            unit_no TEXT,\
            addr_1 TEXT,\
            addr_2 TEXT,\
            city VARCHAR(20),\
            state VARCHAR(20),\
            pincode VARCHAR(4),\
            customer_name VARCHAR(100),\
            card_number VARCHAR(16),\
            card_expiry VARCHAR(4),\
            payment_type VARCHAR(6) NOT NULL,\
            delivery_pickup VARCHAR(1) NOT NULL,\
            total_amount float8 NOT NULL\
            );')
    
    
cur.execute('CREATE TABLE order_items (\
            id SERIAL PRIMARY KEY,\
            order_id INT NOT NULL,\
            FOREIGN KEY (order_id) REFERENCES orders (id),\
            name VARCHAR(100) NOT NULL,\
            price float8 NOT NULL,\
            quantity INT NOT NULL\
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