# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class Address(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, id: int=None, customer_id: int=None, unit_no: str=None, addr_1: str=None, addr_2: str=None, city: str=None, state: str=None, pincode: str=None, primary1: str=None):  # noqa: E501
        """Address - a model defined in Swagger

        :param id: The id of this Address.  # noqa: E501
        :type id: int
        :param customer_id: The customer_id of this Address.  # noqa: E501
        :type customer_id: int
        :param unit_no: The unit_no of this Address.  # noqa: E501
        :type unit_no: str
        :param addr_1: The addr_1 of this Address.  # noqa: E501
        :type addr_1: str
        :param addr_2: The addr_2 of this Address.  # noqa: E501
        :type addr_2: str
        :param city: The city of this Address.  # noqa: E501
        :type city: str
        :param state: The state of this Address.  # noqa: E501
        :type state: str
        :param pincode: The pincode of this Address.  # noqa: E501
        :type pincode: str
        :param primary1: The primary1 of this Address.  # noqa: E501
        :type primary1: str
        """
        self.swagger_types = {
            'id': int,
            'customer_id': int,
            'unit_no': str,
            'addr_1': str,
            'addr_2': str,
            'city': str,
            'state': str,
            'pincode': str,
            'primary1': str
        }

        self.attribute_map = {
            'id': 'id',
            'customer_id': 'customer_id',
            'unit_no': 'unit_no',
            'addr_1': 'addr_1',
            'addr_2': 'addr_2',
            'city': 'city',
            'state': 'state',
            'pincode': 'pincode',
            'primary1': 'primary1'
        }
        self._id = id
        self._customer_id = customer_id
        self._unit_no = unit_no
        self._addr_1 = addr_1
        self._addr_2 = addr_2
        self._city = city
        self._state = state
        self._pincode = pincode
        self._primary1 = primary1

    @classmethod
    def from_dict(cls, dikt) -> 'Address':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The Address of this Address.  # noqa: E501
        :rtype: Address
        """
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> int:
        """Gets the id of this Address.


        :return: The id of this Address.
        :rtype: int
        """
        return self._id

    @id.setter
    def id(self, id: int):
        """Sets the id of this Address.


        :param id: The id of this Address.
        :type id: int
        """

        self._id = id

    @property
    def customer_id(self) -> int:
        """Gets the customer_id of this Address.


        :return: The customer_id of this Address.
        :rtype: int
        """
        return self._customer_id

    @customer_id.setter
    def customer_id(self, customer_id: int):
        """Sets the customer_id of this Address.


        :param customer_id: The customer_id of this Address.
        :type customer_id: int
        """

        self._customer_id = customer_id

    @property
    def unit_no(self) -> str:
        """Gets the unit_no of this Address.


        :return: The unit_no of this Address.
        :rtype: str
        """
        return self._unit_no

    @unit_no.setter
    def unit_no(self, unit_no: str):
        """Sets the unit_no of this Address.


        :param unit_no: The unit_no of this Address.
        :type unit_no: str
        """

        self._unit_no = unit_no

    @property
    def addr_1(self) -> str:
        """Gets the addr_1 of this Address.


        :return: The addr_1 of this Address.
        :rtype: str
        """
        return self._addr_1

    @addr_1.setter
    def addr_1(self, addr_1: str):
        """Sets the addr_1 of this Address.


        :param addr_1: The addr_1 of this Address.
        :type addr_1: str
        """

        self._addr_1 = addr_1

    @property
    def addr_2(self) -> str:
        """Gets the addr_2 of this Address.


        :return: The addr_2 of this Address.
        :rtype: str
        """
        return self._addr_2

    @addr_2.setter
    def addr_2(self, addr_2: str):
        """Sets the addr_2 of this Address.


        :param addr_2: The addr_2 of this Address.
        :type addr_2: str
        """

        self._addr_2 = addr_2

    @property
    def city(self) -> str:
        """Gets the city of this Address.


        :return: The city of this Address.
        :rtype: str
        """
        return self._city

    @city.setter
    def city(self, city: str):
        """Sets the city of this Address.


        :param city: The city of this Address.
        :type city: str
        """

        self._city = city

    @property
    def state(self) -> str:
        """Gets the state of this Address.


        :return: The state of this Address.
        :rtype: str
        """
        return self._state

    @state.setter
    def state(self, state: str):
        """Sets the state of this Address.


        :param state: The state of this Address.
        :type state: str
        """

        self._state = state

    @property
    def pincode(self) -> str:
        """Gets the pincode of this Address.


        :return: The pincode of this Address.
        :rtype: str
        """
        return self._pincode

    @pincode.setter
    def pincode(self, pincode: str):
        """Sets the pincode of this Address.


        :param pincode: The pincode of this Address.
        :type pincode: str
        """

        self._pincode = pincode

    @property
    def primary1(self) -> str:
        """Gets the primary1 of this Address.


        :return: The primary1 of this Address.
        :rtype: str
        """
        return self._primary1

    @primary1.setter
    def primary1(self, primary1: str):
        """Sets the primary1 of this Address.


        :param primary1: The primary1 of this Address.
        :type primary1: str
        """

        self._primary1 = primary1
