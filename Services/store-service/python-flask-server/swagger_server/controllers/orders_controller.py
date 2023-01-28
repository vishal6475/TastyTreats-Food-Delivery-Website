import connexion
import six
#import secrets
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT 

from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.store import Store  # noqa: E501
from swagger_server.models.store_not_found_error import StoreNotFoundError  # noqa: E501
from swagger_server.models.order import Order  # noqa: E501
from swagger_server.models.order_not_found_error import OrderNotFoundError  # noqa: E501
from swagger_server.models.orders_list import OrdersList  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server import util

port = 5432

host = "localhost" # when running the service directly from command prompt
#host='tastytreats-db' # when running the service through Docker

user = "postgres"
db_password = "postgrespw"
database = 'tastytreats'

def create_order(body=None):  # noqa: E501
    """Create a new order

     # noqa: E501

    :param body: Created order object
    :type body: dict | bytes

    :rtype: Order
    """

    try:
        if connexion.request.is_json:
            body = Order.from_dict(connexion.request.get_json())  # noqa: E501
        
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute('SELECT * FROM stores where id = ' + str(body.store_id))
        record = cur.fetchone()
        if record == None:
            error = StoreNotFoundError(code=404, type="StoreNotFoundError", 
                    message="The following Store ID does not exist: " + str(body.store_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        if body.addr_2 == None: body.addr_2 = ''
        if body.city == None: body.city = ''
        if body.state == None: body.state = ''
        if body.pincode == None: body.pincode = ''
        if body.payment_type == None: body.payment_type = 'Card'
        if body.delivery_pickup == None: body.addr_2 = 'D'      

        insert_string = "INSERT INTO orders VALUES (default, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id;"
        cur.execute(insert_string, (body.customer_id, body.store_id, body._date, body.unit_no, body.addr_1, \
            body.addr_2, body.city, body.state, body.pincode, body.customer_name, body.card_number, 
            body.card_expiry, body.payment_type, body.delivery_pickup, body.total_amount ))        
        body.id = cur.fetchone()[0]            

        for item in body.items:
            insert_item_string = "INSERT INTO order_items VALUES (default, %s,%s,%s,%s) RETURNING id;"
            cur.execute(insert_item_string, (body.id, item.name, item.price, item.quantity ))      

        cur.close()
        con.close()            
        return body, 201, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_order_by_id(order_id):  # noqa: E501
    """Get an order by order id

    Returns an order object based on order id. # noqa: E501

    :param order_id: Order id of an order.
    :type order_id: str

    :rtype: Order
    """

    try:
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute('SELECT * FROM orders where id = ' + str(order_id))
        record = cur.fetchone()
        if record != None:
            order = dict()
            order['id'] = int(record[0])
            order['customer_id'] = int(record[1])
            order['store_id'] = int(record[2])
            order['date'] = str(record[3])
            order['unit_no'] = str(record[4])
            order['addr_1'] = str(record[5])
            order['addr_2'] = str(record[6])
            order['city'] = str(record[7])
            order['state'] = str(record[8])
            order['pincode'] = str(record[9])
            order['customer_name'] = str(record[10])
            order['card_number'] = str(record[11])
            order['card_expiry'] = str(record[12])
            order['payment_type'] = str(record[13])
            order['delivery_pickup'] = str(record[14])
            order['total_amount'] = float(record[15])    

            for item in order.keys():
                if order[item] == "None":
                    order[item] = ""  

            order['items'] = []
            cur.execute('SELECT * FROM order_items where order_id = ' + str(order_id))
            records = cur.fetchall()
            for record in records:
                item = dict()
                item['id'] = int(record[0])
                item['order_id'] = int(record[1])
                item['name'] = str(record[2])
                item['price'] = float(record[3])
                item['quantity'] = int(record[4])

                order['items'].append(item)

            cur.execute('SELECT * FROM stores where id = ' + str(order['store_id']))
            record = cur.fetchone()
            order['store_name'] = str(record[1])            

            cur.close()
            con.close()
            return order, 200, {'Access-Control-Allow-Origin': '*'}

        else:
            error = OrderNotFoundError(code=404, type="OrderNotFoundError", 
                    message="The following Order ID does not exist: " + str(order_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}


    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_orders(customer_id=None, store_id=None):  # noqa: E501
    """Get all the order details for a customer or a store

    Returns a list of orders based on customer_id or store_id or both. If no orders found for a given input, it returns an empty array. # noqa: E501

    :param customer_id: Customer id of a customer.
    :type customer_id: str
    :param store_id: Store id of a store/restaurant.
    :type store_id: str

    :rtype: OrdersList
    """

    try:
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()  

        if (customer_id == None and store_id == None):
            error = InvalidInputError(code=400, type="InvalidInputError", 
                   message="At least one of the following mandatory fields are needed: customer_id or store_id")
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        if store_id != None:
            cur.execute('SELECT * FROM stores where id = ' + str(store_id))
            record = cur.fetchone()
            if record == None:
                error = StoreNotFoundError(code=404, type="StoreNotFoundError", 
                        message="The following Store ID does not exist: " + str(store_id))
                cur.close()
                con.close()
                return error, 404, {'Access-Control-Allow-Origin': '*'}

        orders_list = []
        get_string = "SELECT * FROM orders where " 
        if customer_id != None: get_string += " customer_id = " + str(customer_id)
        if (customer_id != None and store_id != None): get_string += ' and '
        if store_id != None: get_string += " store_id = " + str(store_id)

        cur.execute(get_string)
        records = cur.fetchall()
        for record in records:
            order = dict()
            order['id'] = int(record[0])
            order['customer_id'] = int(record[1])
            order['store_id'] = int(record[2])
            order['date'] = str(record[3])
            order['unit_no'] = str(record[4])
            order['addr_1'] = str(record[5])
            order['addr_2'] = str(record[6])
            order['city'] = str(record[7])
            order['state'] = str(record[8])
            order['pincode'] = str(record[9])
            order['customer_name'] = str(record[10])
            order['card_number'] = str(record[11])
            order['card_expiry'] = str(record[12])
            order['payment_type'] = str(record[13])
            order['delivery_pickup'] = str(record[14])
            order['total_amount'] = float(record[15])    

            for item in order.keys():
                if order[item] == "None":
                    order[item] = ""  

            order['items'] = []
            cur.execute('SELECT * FROM order_items where order_id = ' + str(order['id']))
            records = cur.fetchall()
            for record in records:
                item = dict()
                item['id'] = int(record[0])
                item['order_id'] = int(record[1])
                item['name'] = str(record[2])
                item['price'] = float(record[3])
                item['quantity'] = int(record[4])

                order['items'].append(item)            

            cur.execute('SELECT * FROM stores where id = ' + str(order['store_id']))
            record = cur.fetchone()
            order['store_name'] = str(record[1])  

            orders_list.append(order)

        cur.close()
        con.close()
        return orders_list, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}
