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
        
       # if (body.email == None or body.first_name == None or body.last_name == None or body.password == None):
       #     error = InvalidInputError(code=400, type="InvalidInputError", 
       #             message="The following mandatory fields were not provided: email or first name or last name or password")
       #     return error, 400, {'Access-Control-Allow-Origin': '*'}


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
        cur.execute(insert_string, (body.customer_id, body.store_id, body.date, body.unit_no, body.addr_1, \
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
        return 'do some magic!', {'Access-Control-Allow-Origin': '*'}

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
        return 'do some magic!', {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}
