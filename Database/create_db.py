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
img_items_1 = './images/items/1'


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
            '', '', '', 'Pizza,Italian', '11:00', '23:59', 'Y', 5.5, 20, ''\
            );")

cur.execute("INSERT INTO stores values(default, 'Pizza Hut - Belfield', '26A Burwood Road, Belfield NSW 2191, Australia', '', \
            '', '', '', 'Pizza,Italian', '11:00', '23:00', 'Y', 5.5, 20, ''\
            );")

cur.execute("INSERT INTO stores values(default, 'Guzman y Gomez - Auburn', 'shop a24/100 Parramatta Road, Auburn NSW 2144, Australia', '', \
            '', '', '', 'Mexican,Fast Food', '11:00', '22:00', 'Y', 5.5, 0, ''\
            );")

cur.execute("INSERT INTO stores values(default, 'McDonald''s - Burwood Westfield', '100 Burwood Road, Burwood NSW 2134, Australia', '', \
            '', '', '', 'Burgers,Fast Food', '01:00', '21:15', 'Y', 5.5, 20, ''\
            );")
    
cur.execute("INSERT INTO stores values(default, 'Thousand Spices', '23 The Crescent, Homebush NSW 2140, Australia', '', \
            '', '', '', 'Indian,South Indian', '11:00', '23:59', 'Y', 5.5, 20, ''\
            );")
    
cur.execute("INSERT INTO stores values(default, 'Treat Talk Pizza and Kebab', 'shop 1/41 The Boulevarde, Strathfield NSW 2135, Australia', '', \
            '', '', '', 'Turkish,Kebab', '11:00', '00:15', 'Y', 5.5, 0, ''\
            );")
    
cur.execute("INSERT INTO stores values(default, 'Oporto - Strathfield Plaza', '11 The Boulevarde, Strathfield NSW 2135, Australia', '', \
            '', '', '', 'Burgers,Chicken', '11:00', '23:30', 'Y', 5.5, 20, ''\
            );")
    
cur.execute("INSERT INTO stores values(default, 'Subway - Strathfield South', '2/608-612 Liverpool Road, Strathfield South NSW 2136, Australia', '', \
            '', '', '', 'Sandwiches', '11:00', '00:30', 'Y', 5.5, 20, ''\
            );")
    
    
cur.execute("INSERT INTO categories values(default, 1, 'New Yorker Pizzas' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Premium Pizzas' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Traditional Pizzas' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Value Max Range' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Vegan' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Savoury Sides' , 1 );")
"""
cur.execute("INSERT INTO categories values(default, 1, 'Value Max Range' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Value Range' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Savoury Sides' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Chicken Wings' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Desserts' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Icy Cold Drinks' , 1 );")
cur.execute("INSERT INTO categories values(default, 1, 'Dipping Sauces' , 1 );")
"""

""" Items template
cur.execute("INSERT INTO items values(default, 3, '',\
            '',\
            24.99, 0, 1, '' );")
"""
cur.execute("INSERT INTO items values(default, 1, 'Big Cheese',\
            'The cheesiest, sauciest, and most authentic New York-style pizza, cut into 8 super-sized slices. Indulge in soft, foldable dough, rich pizza sauce & more stretchy mozzarella than ever before.',\
            24.99, 1, 1, '' );")
cur.execute("INSERT INTO items values(default, 1, 'Big Hawaiian',\
            'The cheesiest, sauciest, and most authentic New York-style pizza, cut into 8 super-sized slices. Indulge in soft, foldable dough & rich pizza sauce with smokey leg ham and juicy pineapple pieces.',\
            24.99, 1, 1, '' );")
cur.execute("INSERT INTO items values(default, 1, 'Big Pepperoni',\
            'The cheesiest, sauciest, and most authentic New York-style pizza, cut into 8 super-sized slices. Indulge in soft, foldable dough & rich pizza sauce, loaded with your favourite crispy Domino’s pepperoni.',\
            24.99, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 2, 'Mega Meatlovers',\
            'Mega loaded, mega tasty. Featuring seasoned chicken, smoked leg ham, crumbled beef, pepperoni slices, Italian sausage & crispy rasher bacon, brought together with a Hickory BBQ sauce',\
            24.10, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 2, 'Loaded Supreme',\
            'Ground beef, crispy rasher bacon, mushroom, pepperoni, Italian sausage, baby spinach, smoked leg ham & pineapple, topped with oregano, tomato capsicum sauce & spring onions',\
            24.50, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 2, 'Peri Peri Chicken',\
            'A flavoursome pairing of seasoned chicken pieces, Italian cherry tomatoes, sliced red onion & baby spinach, topped with our addictive peri peri sauce',\
            23.30, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 2, 'Garlic Prawn',\
            'Juicy prawns, paired with baby spinach & diced tomato on a crème fraiche & zesty garlic sauce base, topped with oregano',\
            24.50, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 3, 'Spicy Peppy Paneer',\
            'Diced paneer cheese, cherry tomatoes, sliced red onion, capsicum & spicy jalapenos on a tikka sauce base, drizzled with peri peri sauce',\
            21.1, 1, 1, '' );")
cur.execute("INSERT INTO items values(default, 3, 'BBQ Meatlovers',\
            'Crispy rasher bacon, pepperoni pieces, seasoned ground beef, smokey leg ham & Italian sausage, all on a BBQ sauce base',\
            21.40, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 3, 'Vegorama',\
            'Mushrooms, diced tomato, capsicum, baby spinach & slices of red onion, topped with crumbled feta cheese, kalamata olives & oregano',\
            21.50, 1, 1, '' );")
cur.execute("INSERT INTO items values(default, 3, 'Fire Breather',\
            'Domino''s pepperoni, smoked leg ham, seasoned ground beef, fiery jalapenos, tomato & sliced red onion with a spicy hit of chilli flakes',\
            21.40, 0, 1, '' );")
    
    
cur.execute("INSERT INTO items values(default, 4, 'Big Cheese_2',\
            'The cheesiest, sauciest, and most authentic New York-style pizza, cut into 8 super-sized slices. Indulge in soft, foldable dough, rich pizza sauce & more stretchy mozzarella than ever before.',\
            24.99, 1, 1, '' );")
cur.execute("INSERT INTO items values(default, 4, 'Big Hawaiian_2',\
            'The cheesiest, sauciest, and most authentic New York-style pizza, cut into 8 super-sized slices. Indulge in soft, foldable dough & rich pizza sauce with smokey leg ham and juicy pineapple pieces.',\
            24.99, 1, 1, '' );")
cur.execute("INSERT INTO items values(default, 4, 'Big Pepperoni_2',\
            'The cheesiest, sauciest, and most authentic New York-style pizza, cut into 8 super-sized slices. Indulge in soft, foldable dough & rich pizza sauce, loaded with your favourite crispy Domino’s pepperoni.',\
            24.99, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 5, 'Mega Meatlovers_2',\
            'Mega loaded, mega tasty. Featuring seasoned chicken, smoked leg ham, crumbled beef, pepperoni slices, Italian sausage & crispy rasher bacon, brought together with a Hickory BBQ sauce',\
            24.10, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 5, 'Loaded Supreme_2',\
            'Ground beef, crispy rasher bacon, mushroom, pepperoni, Italian sausage, baby spinach, smoked leg ham & pineapple, topped with oregano, tomato capsicum sauce & spring onions',\
            24.50, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 5, 'Peri Peri Chicken_2',\
            'A flavoursome pairing of seasoned chicken pieces, Italian cherry tomatoes, sliced red onion & baby spinach, topped with our addictive peri peri sauce',\
            23.30, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 5, 'Garlic Prawn_2',\
            'Juicy prawns, paired with baby spinach & diced tomato on a crème fraiche & zesty garlic sauce base, topped with oregano',\
            24.50, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 6, 'Spicy Peppy Paneer_2',\
            'Diced paneer cheese, cherry tomatoes, sliced red onion, capsicum & spicy jalapenos on a tikka sauce base, drizzled with peri peri sauce',\
            21.1, 1, 1, '' );")
cur.execute("INSERT INTO items values(default, 6, 'BBQ Meatlovers_2',\
            'Crispy rasher bacon, pepperoni pieces, seasoned ground beef, smokey leg ham & Italian sausage, all on a BBQ sauce base',\
            21.40, 0, 1, '' );")
cur.execute("INSERT INTO items values(default, 6, 'Vegorama_2',\
            'Mushrooms, diced tomato, capsicum, baby spinach & slices of red onion, topped with crumbled feta cheese, kalamata olives & oregano',\
            21.50, 1, 1, '' );")
cur.execute("INSERT INTO items values(default, 6, 'Fire Breather_2',\
            'Domino''s pepperoni, smoked leg ham, seasoned ground beef, fiery jalapenos, tomato & sliced red onion with a spicy hit of chilli flakes',\
            21.40, 0, 1, '' );")
    

# Update the stores table with base64 images
for filename in os.listdir(img_stores_dir):
    f = os.path.join(img_stores_dir, filename)

    with open(f, "rb") as image_file:
        encoded_string = 'data:image/jpeg;base64,' + \
            base64.b64encode(image_file.read()).decode()
        sql = "UPDATE stores SET photo = '{}' where id = {}".format(
            encoded_string, int(filename.split('.')[0]))
        cur.execute(sql)
        
# Update the items table with base64 images
for filename in os.listdir(img_items_1):
    f = os.path.join(img_items_1, filename)

    with open(f, "rb") as image_file:
        encoded_string = 'data:image/jpeg;base64,' + \
            base64.b64encode(image_file.read()).decode()
        sql = "UPDATE items SET photo = '{}' where id = {}".format(
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

cur.execute('SELECT id, category_id, name, description, price, veg, status FROM items')
records = cur.fetchall()
print("\n Menu Items:")
for row in records:
    for j in range(len(row)):
        print(row[j], end=" ")
    print()    
    
    
cur.close()
con.close()