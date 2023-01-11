import psycopg2
import base64
import os
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

port = 5432
host = "localhost"
user = "postgres"
password = "postgrespw"
database = 'tastytreats'
img_stores_dir = './images/stores'


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
            open VARCHAR(5),\
            close VARCHAR(5),\
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

cur.execute("INSERT INTO stores values(default, 'Dominos Strathfield', '187 The Boulevarde, Strathfield NSW, Australia', '', \
            '', '', '', 'Pizza,Italian', '11:00', '23:00', 'Y', 5.5, 20, ''\
            );")

cur.execute("INSERT INTO stores values(default, 'Pizza Hut - Belfield', '26A Burwood Road, Belfield NSW 2191, Australia', '', \
            '', '', '', 'Pizza,Italian', '11:00', '23:00', 'Y', 5.5, 20, ''\
            );")

cur.execute("INSERT INTO stores values(default, 'Guzman y Gomez - Auburn', 'shop a24/100 Parramatta Road, Auburn NSW 2144, Australia', '', \
            '', '', '', 'Mexican,Fast Food', '11:00', '23:00', 'Y', 5.5, 20, ''\
            );")

cur.execute("INSERT INTO stores values(default, 'McDonald''s - Burwood Westfield', '100 Burwood Road, Burwood NSW 2134, Australia', '', \
            '', '', '', 'Burgers,Fast Food', '11:00', '23:00', 'Y', 5.5, 20, ''\
            );")
    
cur.execute("INSERT INTO stores values(default, 'Thousand Spices', '23 The Crescent, Homebush NSW 2140, Australia', '', \
            '', '', '', 'Indian,South Indian', '11:00', '23:00', 'Y', 5.5, 20, ''\
            );")
    
cur.execute("INSERT INTO stores values(default, 'Treat Talk Pizza and Kebab', 'shop 1/41 The Boulevarde, Strathfield NSW 2135, Australia', '', \
            '', '', '', 'Turkish,Kebab', '11:00', '23:00', 'Y', 5.5, 20, ''\
            );")
    
cur.execute("INSERT INTO stores values(default, 'Oporto - Strathfield Plaza', '11 The Boulevarde, Strathfield NSW 2135, Australia', '', \
            '', '', '', 'Burgers,Chicken', '11:00', '23:00', 'Y', 5.5, 20, ''\
            );")
    
cur.execute("INSERT INTO stores values(default, 'Subway - Strathfield South', '2/608-612 Liverpool Road, Strathfield South NSW 2136, Australia', '', \
            '', '', '', 'Sandwiches', '11:00', '23:00', 'Y', 5.5, 20, ''\
            );")
    

# Update the event table with base64 images
for filename in os.listdir(img_stores_dir):
    f = os.path.join(img_stores_dir, filename)

    with open(f, "rb") as image_file:
        encoded_string = 'data:image/jpeg;base64,' + \
            base64.b64encode(image_file.read()).decode()
        sql = "UPDATE stores SET photo = '{}' where id = {}".format(
            encoded_string, int(filename.split('.')[0]))
        cur.execute(sql)
        
cur.execute('SELECT * FROM customers')
records = cur.fetchall()
print("\n Customers:")
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
print("\n Cards:")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()    

cur.execute('SELECT id, name, addr_1, addr_2, city, state, pincode, types, open, close, \
            delivery, delivery_fee float8, min_order FROM stores')
records = cur.fetchall()
print("\n Stores:")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()    

cur.execute('SELECT * FROM categories')
records = cur.fetchall()
print("\n Categories:")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()    

cur.execute('SELECT * FROM items')
records = cur.fetchall()
print("\n Menu Items:")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()    
    
    
cur.close()
con.close()