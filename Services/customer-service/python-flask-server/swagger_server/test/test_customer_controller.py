# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

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
from swagger_server.test import BaseTestCase


class TestCustomerController(BaseTestCase):
    """CustomerController integration test stubs"""

    def test_create_customer(self):
        """Test case for create_customer

        Create customer
        """
        body = Customer()
        data = dict(id=789,
                    first_name='first_name_example',
                    last_name='last_name_example',
                    email='email_example',
                    password='password_example',
                    mobile_no='mobile_no_example',
                    location='location_example',
                    profile_pic='profile_pic_example',
                    token='token_example',
                    points=1.2)
        response = self.client.open(
            '/customer',
            method='POST',
            data=json.dumps(body),
            data=data,
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_addresses_by_id(self):
        """Test case for get_addresses_by_id

        Get all customer addresses by customer id
        """
        response = self.client.open(
            '/customer/{customer_id}/address'.format(customer_id='customer_id_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_card_by_id(self):
        """Test case for get_card_by_id

        Get all customer's cards by customer id
        """
        response = self.client.open(
            '/customer/{customer_id}/cards'.format(customer_id='customer_id_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_customer_by_id(self):
        """Test case for get_customer_by_id

        Get customer by customer id
        """
        response = self.client.open(
            '/customer/{customer_id}'.format(customer_id='customer_id_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_login_customer(self):
        """Test case for login_customer

        Logs a customer into the system
        """
        query_string = [('email', 'email_example'),
                        ('password', 'password_example')]
        response = self.client.open(
            '/customer/login',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_logout_customer(self):
        """Test case for logout_customer

        Logs out current logged in customer session
        """
        query_string = [('email', 'email_example')]
        response = self.client.open(
            '/customer/logout',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_address(self):
        """Test case for update_address

        Update customer address
        """
        body = Address()
        query_string = [('address_id', 'address_id_example')]
        response = self.client.open(
            '/customer/{customer_id}/address'.format(customer_id='customer_id_example'),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_card(self):
        """Test case for update_card

        Update card details
        """
        body = Card()
        query_string = [('card_id', 'card_id_example')]
        response = self.client.open(
            '/customer/{customer_id}/cards'.format(customer_id='customer_id_example'),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_customer(self):
        """Test case for update_customer

        Update customer
        """
        body = Customer()
        response = self.client.open(
            '/customer/{customer_id}'.format(customer_id='customer_id_example'),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
