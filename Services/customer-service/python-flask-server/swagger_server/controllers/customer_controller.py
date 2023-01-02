import connexion
import six

from swagger_server.models.address import Address  # noqa: E501
from swagger_server.models.address_list import AddressList  # noqa: E501
from swagger_server.models.address_not_found_error import AddressNotFoundError  # noqa: E501
from swagger_server.models.card import Card  # noqa: E501
from swagger_server.models.card_list import CardList  # noqa: E501
from swagger_server.models.card_not_found_error import CardNotFoundError  # noqa: E501
from swagger_server.models.customer import Customer  # noqa: E501
from swagger_server.models.customer_not_found_error import CustomerNotFoundError  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server import util


def create_customer(body=None):  # noqa: E501
    """Create customer

     # noqa: E501

    :param body: Created customer object
    :type body: dict | bytes

    :rtype: Customer
    """
    if connexion.request.is_json:
        body = Customer.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def create_customer(id=None, first_name=None, last_name=None, email=None, password=None, mobile_no=None, location=None, profile_pic=None, token=None, points=None):  # noqa: E501
    """Create customer

     # noqa: E501

    :param id: 
    :type id: int
    :param first_name: 
    :type first_name: str
    :param last_name: 
    :type last_name: str
    :param email: 
    :type email: str
    :param password: 
    :type password: str
    :param mobile_no: 
    :type mobile_no: str
    :param location: 
    :type location: str
    :param profile_pic: 
    :type profile_pic: str
    :param token: 
    :type token: str
    :param points: 
    :type points: float

    :rtype: Customer
    """
    return 'do some magic!'


def get_addresses_by_id(customer_id):  # noqa: E501
    """Get all customer addresses by customer id

     # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str

    :rtype: AddressList
    """
    return 'do some magic!'


def get_card_by_id(customer_id):  # noqa: E501
    """Get all customer&#x27;s cards by customer id

     # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str

    :rtype: CardList
    """
    return 'do some magic!'


def get_customer_by_id(customer_id):  # noqa: E501
    """Get customer by customer id

    Retrieve all details of a customer using their id # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str

    :rtype: Customer
    """
    return 'do some magic!'


def login_customer(email, password):  # noqa: E501
    """Logs a customer into the system

    This logs a customer into the system and returns authorized token # noqa: E501

    :param email: The email address of a customer
    :type email: str
    :param password: The password for login
    :type password: str

    :rtype: Customer
    """
    return 'do some magic!'


def logout_customer(email):  # noqa: E501
    """Logs out current logged in customer session

     # noqa: E501

    :param email: The email address of a customer
    :type email: str

    :rtype: Customer
    """
    return 'do some magic!'


def update_address(customer_id, body=None, address_id=None):  # noqa: E501
    """Update customer address

    This can only be done by the logged in customer. # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str
    :param body: Update an existent customer address in the database
    :type body: dict | bytes
    :param address_id: Address id that needs to be updated
    :type address_id: str

    :rtype: Address
    """
    if connexion.request.is_json:
        body = Address.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def update_card(customer_id, body=None, card_id=None):  # noqa: E501
    """Update card details

    This can only be done by the logged in customer. # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str
    :param body: Update an existent customer&#x27;s card details in the database
    :type body: dict | bytes
    :param card_id: Card id that needs to be updated
    :type card_id: str

    :rtype: Card
    """
    if connexion.request.is_json:
        body = Card.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def update_customer(customer_id, body=None):  # noqa: E501
    """Update customer

    This can only be done by the logged in customer. # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str
    :param body: Update an existent customer in the database
    :type body: dict | bytes

    :rtype: Customer
    """
    if connexion.request.is_json:
        body = Customer.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
