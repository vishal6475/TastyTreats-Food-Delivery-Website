import connexion
import six

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


def create_store(body=None):  # noqa: E501
    """Create a new store/restaurant

     # noqa: E501

    :param body: Creates a store object.
    :type body: dict | bytes

    :rtype: Store
    """
    if connexion.request.is_json:
        body = Store.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def get_store_by_id(store_id):  # noqa: E501
    """Get a store and its menu by store id

    Retrieve a store&#x27;s and its menu items using store id # noqa: E501

    :param store_id: Store id of a store/restaurant.
    :type store_id: str

    :rtype: Store
    """
    return 'do some magic!'


def get_stores():  # noqa: E501
    """Get all the stores

    Retrieve details of all the stores. # noqa: E501


    :rtype: StoresList
    """
    return 'do some magic!'


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
    if connexion.request.is_json:
        body = Category.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


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
    if connexion.request.is_json:
        body = Item.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def update_store(store_id, body=None):  # noqa: E501
    """Update a store

    It updates the details of a store # noqa: E501

    :param store_id: Store id of a store/restaurant.
    :type store_id: str
    :param body: Update an existing store in the database.
    :type body: dict | bytes

    :rtype: Store
    """
    if connexion.request.is_json:
        body = Store.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
