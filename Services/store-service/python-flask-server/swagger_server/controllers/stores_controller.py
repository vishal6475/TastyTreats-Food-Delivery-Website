import connexion
import six
#import secrets
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT 

from swagger_server.models.category import Category  # noqa: E501
from swagger_server.models.category_not_found_error import CategoryNotFoundError  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.item import Item  # noqa: E501
from swagger_server.models.item_not_found_error import ItemNotFoundError  # noqa: E501
from swagger_server.models.store import Store  # noqa: E501
from swagger_server.models.store_not_found_error import StoreNotFoundError  # noqa: E501
from swagger_server.models.stores_list import StoresList  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server import util

port = 5432

#host = "localhost" # when running the service directly from command prompt
host='tastytreats-db' # when running the service through Docker

user = "postgres"
db_password = "postgrespw"
database = 'tastytreats'

def create_store(body=None):  # noqa: E501
    """Create a new store/restaurant

     # noqa: E501

    :param body: Creates a store object.
    :type body: dict | bytes

    :rtype: Store
    """

    try:
        if connexion.request.is_json:
            body = Store.from_dict(connexion.request.get_json())  # noqa: E501
        
        if (body.name == None or body.addr_1 == None or body.open == None or body.close == None):
            error = InvalidInputError(code=400, type="InvalidInputError", 
                    message="The following mandatory fields were not provided: name or address or open or closing time")
            return error, 400, {'Access-Control-Allow-Origin': '*'}


        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()


        insert_string = "INSERT INTO stores VALUES (default, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id;"
        cur.execute(insert_string, (body.name, body.addr_1, body.addr_2, body.city, body.state, body.pincode, \
            body.types, body.open, body.close, body.delivery, body.delivery_fee, body.min_order, body.photo))        
        body.id = cur.fetchone()[0]

        cur.close()
        con.close()            
        return body, 201, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_store_by_id(store_id):  # noqa: E501
    """Get a store and its menu by store id

    Retrieve a store&#x27;s and its menu items using store id # noqa: E501

    :param store_id: Store id of a store/restaurant.
    :type store_id: str

    :rtype: Store
    """

    try:
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute('SELECT * FROM stores where id = ' + str(store_id))
        record = cur.fetchone()
        if record == None:
            error = StoreNotFoundError(code=404, type="StoreNotFoundError", 
                    message="The following Store ID does not exist: " + str(store_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        store = dict()
        store['id'] = int(record[0])
        store['name'] = str(record[1])
        store['addr_1'] = str(record[2])
        store['addr_2'] = str(record[3])
        store['city'] = str(record[4])
        store['state'] = str(record[5])
        store['pincode'] = str(record[6])
        store['types'] = str(record[7]).split(',')
        store['open'] = str(record[8])
        store['close'] = str(record[9])
        store['delivery'] = str(record[10])
        store['delivery_fee'] = float(record[11])
        store['min_order'] = float(record[12])
        store['photo'] = str(record[13])
        store['categories'] = []

        cur.execute('SELECT * FROM categories where store_id = ' + str(store_id))
        records = cur.fetchall()
        for record in records:
            category = dict()
            category['id'] = int(record[0])
            category['category'] = str(record[2])
            category['display_sequence'] = str(record[3])
            category['items'] = []

            cur.execute('SELECT * FROM items where category_id = ' + str(category['id']))
            item_records = cur.fetchall()
            for item_rec in item_records:
                if int(item_rec[6]) == 1:
                    item = dict()
                    item['id'] = int(item_rec[0])
                    item['name'] = str(item_rec[2])
                    item['description'] = str(item_rec[3])
                    item['price'] = float(item_rec[4])
                    item['veg'] = int(item_rec[5])
                    item['status'] = int(item_rec[6])
                    item['photo'] = str(item_rec[7])
                    
                    category['items'].append(item)

            store['categories'].append(category)

        for item in store.keys():
            if store[item] == "None":
                store[item] = ""  

        cur.close()
        con.close()
        return store, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_stores():  # noqa: E501
    """Get all the stores

    Retrieve details of all the stores. # noqa: E501


    :rtype: StoresList
    """

    try:
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute('SELECT * FROM stores')
        records = cur.fetchall()
        stores_list = []
        for record in records:
            store = dict()
            store['id'] = int(record[0])
            store['name'] = str(record[1])
            store['addr_1'] = str(record[2])
            store['addr_2'] = str(record[3])
            store['city'] = str(record[4])
            store['state'] = str(record[5])
            store['pincode'] = str(record[6])
            store['types'] = str(record[7]).split(',')
            store['open'] = str(record[8])
            store['close'] = str(record[9])
            store['delivery'] = str(record[10])
            store['delivery_fee'] = float(record[11])
            store['min_order'] = float(record[12])
            store['photo'] = str(record[13])

            for item in store.keys():
                if store[item] == "None":
                    store[item] = ""  

            stores_list.append(store)

        cur.close()
        con.close()
        return stores_list, 200, {'Access-Control-Allow-Origin': '*'}


    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def update_category(store_id, body=None, category_id=None):  # noqa: E501
    """Update a category

    It creates a new category for a store or updates the details of an existing category (if category_id is provided). # noqa: E501

    :param store_id: Store id of a store/restaurant.
    :type store_id: str
    :param body: Update an existing category in the database
    :type body: dict | bytes
    :param category_id: Id of a food category of a store.
    :type category_id: str

    :rtype: Category
    """

    try:
        if connexion.request.is_json:
            body = Category.from_dict(connexion.request.get_json())  # noqa: E501

        """ THIS WILL BE DONE IN SPRINT 2 WHEN BUSINES SIDE UI IS BEING CREATED """

        return 'do some magic!', {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def update_item(store_id, category_id, body=None, item_id=None):  # noqa: E501
    """Update a menu item

    It creates a new menu item for a store or updates the details of an existing item (if item_id is provided). # noqa: E501

    :param store_id: Store id of a store/restaurant.
    :type store_id: str
    :param category_id: Id of a food category of a store.
    :type category_id: str
    :param body: Update an existing item in the database
    :type body: dict | bytes
    :param item_id: Id of a food menu item of a store.
    :type item_id: str

    :rtype: Item
    """

    try:
        if connexion.request.is_json:
            body = Item.from_dict(connexion.request.get_json())  # noqa: E501
        
        """ THIS WILL BE DONE IN SPRINT 2 WHEN BUSINES SIDE UI IS BEING CREATED """

        return 'do some magic!', {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def update_store(store_id, body=None):  # noqa: E501
    """Update a store

    It updates the details of a store # noqa: E501

    :param store_id: Store id of a store/restaurant.
    :type store_id: str
    :param body: Update an existing store in the database.
    :type body: dict | bytes

    :rtype: Store
    """

    try:
        if connexion.request.is_json:
            body = Store.from_dict(connexion.request.get_json())  # noqa: E501
        
        """ THIS WILL BE DONE IN SPRINT 2 WHEN BUSINES SIDE UI IS BEING CREATED """

        return 'do some magic!', {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}
