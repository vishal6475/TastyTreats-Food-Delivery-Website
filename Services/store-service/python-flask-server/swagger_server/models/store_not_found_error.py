# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server.models.error import Error  # noqa: F401,E501
from swagger_server import util


class StoreNotFoundError(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    def __init__(self, code: str=None, type: str=None, message: str=None):  # noqa: E501
        """StoreNotFoundError - a model defined in Swagger

        :param code: The code of this StoreNotFoundError.  # noqa: E501
        :type code: str
        :param type: The type of this StoreNotFoundError.  # noqa: E501
        :type type: str
        :param message: The message of this StoreNotFoundError.  # noqa: E501
        :type message: str
        """
        self.swagger_types = {
            'code': str,
            'type': str,
            'message': str
        }

        self.attribute_map = {
            'code': 'code',
            'type': 'type',
            'message': 'message'
        }
        self._code = code
        self._type = type
        self._message = message

    @classmethod
    def from_dict(cls, dikt) -> 'StoreNotFoundError':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The StoreNotFoundError of this StoreNotFoundError.  # noqa: E501
        :rtype: StoreNotFoundError
        """
        return util.deserialize_model(dikt, cls)

    @property
    def code(self) -> str:
        """Gets the code of this StoreNotFoundError.


        :return: The code of this StoreNotFoundError.
        :rtype: str
        """
        return self._code

    @code.setter
    def code(self, code: str):
        """Sets the code of this StoreNotFoundError.


        :param code: The code of this StoreNotFoundError.
        :type code: str
        """

        self._code = code

    @property
    def type(self) -> str:
        """Gets the type of this StoreNotFoundError.


        :return: The type of this StoreNotFoundError.
        :rtype: str
        """
        return self._type

    @type.setter
    def type(self, type: str):
        """Sets the type of this StoreNotFoundError.


        :param type: The type of this StoreNotFoundError.
        :type type: str
        """

        self._type = type

    @property
    def message(self) -> str:
        """Gets the message of this StoreNotFoundError.


        :return: The message of this StoreNotFoundError.
        :rtype: str
        """
        return self._message

    @message.setter
    def message(self, message: str):
        """Sets the message of this StoreNotFoundError.


        :param message: The message of this StoreNotFoundError.
        :type message: str
        """

        self._message = message
