import connexion
import six
import secrets
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
host = "localhost"
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
        return 'do some magic!'

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
        return 'do some magic!'

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
        return 'do some magic!'

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
        return 'do some magic!'

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
        return 'do some magic!'

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
        return 'do some magic!'

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}
