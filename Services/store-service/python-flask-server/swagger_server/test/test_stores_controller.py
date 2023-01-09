# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.category import Category  # noqa: E501
from swagger_server.models.category_not_found_error import CategoryNotFoundError  # noqa: E501
from swagger_server.models.invalid_input_error import InvalidInputError  # noqa: E501
from swagger_server.models.item import Item  # noqa: E501
from swagger_server.models.item_not_found_error import ItemNotFoundError  # noqa: E501
from swagger_server.models.store import Store  # noqa: E501
from swagger_server.models.store_not_found_error import StoreNotFoundError  # noqa: E501
from swagger_server.models.stores_list import StoresList  # noqa: E501
from swagger_server.models.unexpected_service_error import UnexpectedServiceError  # noqa: E501
from swagger_server.test import BaseTestCase


class TestStoresController(BaseTestCase):
    """StoresController integration test stubs"""

    def test_create_store(self):
        """Test case for create_store

        Create a new store/restaurant
        """
        body = Store()
        response = self.client.open(
            '/v1/stores',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_store_by_id(self):
        """Test case for get_store_by_id

        Get a store and its menu by store id
        """
        response = self.client.open(
            '/v1/stores/{store_id}'.format(store_id='store_id_example'),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_stores(self):
        """Test case for get_stores

        Get all the stores
        """
        response = self.client.open(
            '/v1/stores',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_category(self):
        """Test case for update_category

        Update a category
        """
        body = Category()
        query_string = [('category_id', 'category_id_example')]
        response = self.client.open(
            '/v1/stores/{store_id}/category'.format(store_id='store_id_example'),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_item(self):
        """Test case for update_item

        Update a menu item
        """
        body = Item()
        query_string = [('item_id', 'item_id_example')]
        response = self.client.open(
            '/v1/stores/{store_id}/category/{category_id}/item'.format(store_id='store_id_example', category_id='category_id_example'),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_store(self):
        """Test case for update_store

        Update a store
        """
        body = Store()
        response = self.client.open(
            '/v1/stores/{store_id}'.format(store_id='store_id_example'),
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
