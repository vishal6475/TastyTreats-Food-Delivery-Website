# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.order import Order  # noqa: E501
from swagger_server.models.order_not_found_error import OrderNotFoundError  # noqa: E501
from swagger_server.models.orders_list import OrdersList  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestOrdersController(BaseTestCase):
    """OrdersController integration test stubs"""

    def test_create_order(self):
        """Test case for create_order

        Create a new order
        """
        body = Order()
        response = self.client.open(
            '/v1/orders',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_order_by_id(self):
        """Test case for get_order_by_id

        Get an order by order id
        """
        response = self.client.open(
            '/v1/orders/{order_id}'.format(order_id='order_id_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_orders(self):
        """Test case for get_orders

        Get all the order details for a customer or a store
        """
        query_string = [('customer_id', 'customer_id_example'),
                        ('store_id', 'store_id_example')]
        response = self.client.open(
            '/v1/orders',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
