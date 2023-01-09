import connexion
import six

from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.order import Order  # noqa: E501
from swagger_server.models.order_not_found_error import OrderNotFoundError  # noqa: E501
from swagger_server.models.orders_list import OrdersList  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server import util


def create_order(body=None):  # noqa: E501
    """Create a new order

     # noqa: E501

    :param body: Created order object
    :type body: dict | bytes

    :rtype: Order
    """
    if connexion.request.is_json:
        body = Order.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def get_order_by_id(order_id):  # noqa: E501
    """Get an order by order id

    Returns an order object based on order id. # noqa: E501

    :param order_id: Order id of an order.
    :type order_id: str

    :rtype: Order
    """
    return 'do some magic!'


def get_orders(customer_id=None, store_id=None):  # noqa: E501
    """Get all the order details for a customer or a store

    Returns a list of orders based on customer_id or store_id or both. If no orders found for a given input, it returns an empty array. # noqa: E501

    :param customer_id: Customer id of a customer.
    :type customer_id: str
    :param store_id: Store id of a store/restaurant.
    :type store_id: str

    :rtype: OrdersList
    """
    return 'do some magic!'
