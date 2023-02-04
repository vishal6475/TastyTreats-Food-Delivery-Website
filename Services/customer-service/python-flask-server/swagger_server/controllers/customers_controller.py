import connexion
import six
#import secrets
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT 

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

port = 5432

host = "localhost" # when running the service directly from command prompt
#host='tastytreats-db' # when running the service through Docker

user = "postgres"
db_password = "postgrespw"
database = 'tastytreats'

def create_customer(body=None):  # noqa: E501
    """Create customer

     # noqa: E501

    :param body: Created customer object
    :type body: dict | bytes

    :rtype: Customer
    """

    try:
        if connexion.request.is_json:
            body = Customer.from_dict(connexion.request.get_json())  # noqa: E501
        
        if (body.email == None or body.first_name == None or body.last_name == None or body.password == None):
            error = InvalidInputError(code=400, type="InvalidInputError", 
                    message="The following mandatory fields were not provided: email or first name or last name or password")
            return error, 400, {'Access-Control-Allow-Origin': '*'}


        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute("SELECT * FROM customers where email = '"+str(body.email.replace("'", "''"))+"';")

        record = cur.fetchone()
        if record != None:
            error = InvalidInputError(code=409, type="InvalidInputError", 
                    message="The provided email address already exists in database.")
            cur.close()
            con.close()
            return error, 400, {'Access-Control-Allow-Origin': '*'}

        body.points = str(0.0) #New users will have 0 reward points
        body.token = '1w2e3r4t5y6u7i8o'

        if body.location == None: body.location = ''
        if body.mobile_no == None: body.mobile_no = ''
        if body.profile_pic == None: body.profile_pic = ''

        insert_string = "INSERT INTO customers VALUES (default, %s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id;"
        cur.execute(insert_string, (body.first_name, body.last_name, body.email, \
            body.password, body.mobile_no, body.location, body.profile_pic, \
            body.token, body.points))        
        body.id = cur.fetchone()[0]

        cur.close()
        con.close()            
        return body, 201, {'Access-Control-Allow-Origin': '*'}


    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_addresses_by_id(customer_id):  # noqa: E501
    """Get all customer addresses by customer id

    Returns a list of addresses. # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str

    :rtype: AddressList
    """
    
    try:
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute('SELECT * FROM customers where id = ' + str(customer_id))
        record = cur.fetchone()
        if record == None:
            error = CustomerNotFoundError(code=404, type="CustomerNotFoundError", 
                    message="The following Customer ID does not exist: " + str(customer_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        cur.execute('SELECT * FROM addresses where customer_id = ' + str(customer_id) + ' order by id')
        records = cur.fetchall()
        address_list = []
        for record in records:
            address = dict()
            address['id'] = int(record[0])
            address['customer_id'] = int(record[1])
            address['unit_no'] = str(record[2])
            address['addr_1'] = str(record[3])
            address['addr_2'] = str(record[4])
            address['city'] = str(record[5])
            address['state'] = str(record[6])
            address['pincode'] = str(record[7])
            address['primary1'] = str(record[8])

            for item in address.keys():
                if address[item] == "None":
                    address[item] = ""  

            address_list.append(address)

        cur.close()
        con.close()
        return address_list, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}



def get_cards_by_id(customer_id):  # noqa: E501
    """Get all customer&#x27;s cards by customer id

    Returns a list of cards. Returns an empty array if no card exists. # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str

    :rtype: CardList
    """
    
    try:
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute('SELECT * FROM customers where id = ' + str(customer_id))
        record = cur.fetchone()
        if record == None:
            error = CustomerNotFoundError(code=404, type="CustomerNotFoundError", 
                    message="The following Customer ID does not exist: " + str(customer_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        cur.execute('SELECT * FROM cards where customer_id = ' + str(customer_id) + ' order by id')
        records = cur.fetchall()
        cards_list = []
        for record in records:
            card = dict()
            card['id'] = int(record[0])
            card['customer_id'] = int(record[1])
            card['customer_name'] = str(record[2])
            card['card_number'] = str(record[3])
            card['card_expiry'] = str(record[4])
            card['primary1'] = str(record[5])

            for item in card.keys():
                if card[item] == "None":
                    card[item] = ""  

            cards_list.append(card)

        cur.close()
        con.close()
        return cards_list, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def get_customer_by_id(customer_id):  # noqa: E501
    """Get customer by customer id

    Retrieve all details of a customer using their id # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str

    :rtype: Customer
    """
    
    try:
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute('SELECT * FROM customers where id = ' + str(customer_id))
        record = cur.fetchone()
        if record != None:
            customer = dict()
            customer['id'] = int(record[0])
            customer['first_name'] = str(record[1])
            customer['last_name'] = str(record[2])
            customer['email'] = str(record[3])
            customer['password'] = str(record[4])
            customer['mobile_no'] = str(record[5])
            customer['location'] = str(record[6])
            customer['profile_pic'] = str(record[7])
            customer['token'] = str(record[8])
            customer['points'] = float(record[9])

            for item in customer.keys():
                if customer[item] == "None":
                    customer[item] = ""  

            cur.close()
            con.close()
            return customer, 200, {'Access-Control-Allow-Origin': '*'}

        else:
            error = CustomerNotFoundError(code=404, type="CustomerNotFoundError", 
                    message="The following Customer ID does not exist: " + str(customer_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def login_customer(email, password):  # noqa: E501
    """Logs a customer into the system

    This logs a customer into the system and returns authorized token # noqa: E501

    :param email: The email address of a customer
    :type email: str
    :param password: The password for login
    :type password: str

    :rtype: Customer
    """

    try:
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute("SELECT * FROM customers where email = '"+str(email.replace("'", "''"))+"';")
        record = cur.fetchone()
        if record != None:
            if password != str(record[4]):
                error = InvalidInputError(code=403, type="InvalidInputError", 
                    message="The password does not match the provided email: " + str(email))
                cur.close()
                con.close()
                return error, 400, {'Access-Control-Allow-Origin': '*'}

            new_token = '1w2e3r4t5y6u7i8o'

            customer = dict()
            customer['id'] = int(record[0])
            customer['first_name'] = str(record[1])
            customer['last_name'] = str(record[2])
            customer['email'] = str(record[3])
            customer['password'] = str(record[4])
            customer['mobile_no'] = str(record[5])
            customer['location'] = str(record[6])
            customer['profile_pic'] = str(record[7])
            customer['token'] = new_token
            customer['points'] = float(record[9])
            customer['addresses'] = get_addresses_by_id(int(record[0]))[0]
            customer['cards'] = get_cards_by_id(int(record[0]))[0]

            for item in customer.keys():
                if customer[item] == "None":
                    customer[item] = ""  

            update_string = "UPDATE customers set token = '" + str(new_token) + "'"                
            cur.execute(update_string)

            cur.close()
            con.close()
            return customer, 200, {'Access-Control-Allow-Origin': '*'}

        else:
            error = InvalidInputError(code=403, type="InvalidInputError", 
                    message="The following email does not exist: " + str(email))
            cur.close()
            con.close()
            return error, 400, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def logout_customer(email):  # noqa: E501
    """Logs out current logged in customer session

     # noqa: E501

    :param email: The email address of a customer
    :type email: str

    :rtype: Customer
    """
    
    try:
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        cur.execute("SELECT * FROM customers where email = '"+str(email.replace("'", "''"))+"';")
        record = cur.fetchone()
        if record != None:
            new_token = ''

            customer = dict()
            customer['id'] = int(record[0])
            customer['first_name'] = str(record[1])
            customer['last_name'] = str(record[2])
            customer['email'] = str(record[3])
            customer['password'] = str(record[4])
            customer['mobile_no'] = str(record[5])
            customer['location'] = str(record[6])
            customer['profile_pic'] = str(record[7])
            customer['token'] = new_token
            customer['points'] = float(record[9])

            for item in customer.keys():
                if customer[item] == "None":
                    customer[item] = ""  

            update_string = "UPDATE customers set token = '" + str(new_token) + "'"                
            cur.execute(update_string)

            cur.close()
            con.close()
            return customer, 200, {'Access-Control-Allow-Origin': '*'}

        else:
            error = InvalidInputError(code=403, type="InvalidInputError", 
                    message="The following email does not exist: " + str(email))
            cur.close()
            con.close()
            return error, 400, {'Access-Control-Allow-Origin': '*'}


    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


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

    try:
        if connexion.request.is_json:
            body = Address.from_dict(connexion.request.get_json())  # noqa: E501
        
        if (body.addr_1 == None):
            error = InvalidInputError(code=400, type="InvalidInputError", 
                    message="The following mandatory field was not provided: street address")
            return error, 400, {'Access-Control-Allow-Origin': '*'}        
        if body.unit_no == None: body.unit_no = ''    
        if body.addr_2 == None: body.addr_2 = '' 
        if body.city == None: body.city = '' 
        if body.state == None: body.state = '' 
        if body.pincode == None: body.pincode = ''
        if body.primary1 == None or body.primary1 == '': body.primary1 = 'N'

        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        # to check if the customer id exists or not
        cur.execute('SELECT * FROM customers where id = ' + str(customer_id))
        record = cur.fetchone()
        if record == None:
            error = CustomerNotFoundError(code=404, type="CustomerNotFoundError", 
                    message="The following Customer ID does not exist: " + str(customer_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        if address_id == None:  # to add a new address 
            cur.execute('SELECT * FROM addresses where customer_id = ' + str(customer_id))
            record = cur.fetchone()
            if record == None: body.primary1 = 'Y'

            insert_string = "INSERT INTO addresses VALUES (default, %s,%s,%s,%s,%s,%s,%s,%s) RETURNING id;"
            cur.execute(insert_string, (customer_id, body.unit_no, body.addr_1, body.addr_2, body.city, body.state, \
                body.pincode, body.primary1))
            addr_id = cur.fetchone()[0]
        else: # to update the address details if it already exists
            cur.execute('SELECT * FROM addresses where id = ' + str(address_id) + ' and customer_id = ' + str(customer_id))
            record = cur.fetchone()
            if record == None:
                error = AddressNotFoundError(code=404, type="AddressNotFoundError", 
                        message=f"The address ID {address_id} does not exist or does not belong to customer {customer_id}.")
                cur.close()
                con.close()
                return error, 404, {'Access-Control-Allow-Origin': '*'}

            update_string = "UPDATE addresses set unit_no=%s, addr_1=%s, addr_2=%s, city=%s, state=%s, pincode=%s, \
                primary1=%s where id = %s and customer_id = %s  RETURNING id;"
            cur.execute(update_string, (body.unit_no, body.addr_1, body.addr_2, body.city, body.state, body.pincode, \
                body.primary1, address_id, customer_id))
            cust_id = cur.fetchone()[0]

            if body.primary1 == 'Y': # setting all other addresses to non-primary
                update_string = "UPDATE addresses set primary1='N' where id != %s and customer_id = %s"
                cur.execute(update_string, (address_id, customer_id))

        
        cur.close()
        con.close() 
        return body, 200, {'Access-Control-Allow-Origin': '*'}

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


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

    try:
        if connexion.request.is_json:
            body = Card.from_dict(connexion.request.get_json())  # noqa: E501
        
        if (body.customer_name == None or body.card_number == None or body.card_expiry == None):
            error = InvalidInputError(code=400, type="InvalidInputError", 
                    message="The following mandatory fields were not provided: customer name or number or expiry")
            return error, 400, {'Access-Control-Allow-Origin': '*'}
        if body.primary1 == None or body.primary1 == '': body.primary1 = 'N'

        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        # to check if the customer id exists or not
        cur.execute('SELECT * FROM customers where id = ' + str(customer_id))
        record = cur.fetchone()
        if record == None:
            error = CustomerNotFoundError(code=404, type="CustomerNotFoundError", 
                    message="The following Customer ID does not exist: " + str(customer_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        if card_id == None:  # to add a new card
            cur.execute('SELECT * FROM cards where customer_id = ' + str(customer_id))
            record = cur.fetchone()
            if record == None: body.primary1 = 'Y'

            insert_string = "INSERT INTO cards VALUES (default, %s,%s,%s,%s,%s) RETURNING id;"
            cur.execute(insert_string, (customer_id, body.customer_name, body.card_number, body.card_expiry, body.primary1))
            body.id = cur.fetchone()[0]
        else: # to update the card details if it already exists
            cur.execute('SELECT * FROM cards where id = ' + str(card_id) + ' and customer_id = ' + str(customer_id))
            record = cur.fetchone()
            if record == None:
                error = CardNotFoundError(code=404, type="CardNotFoundError", 
                        message=f"The address ID {card_id} does not exist or does not belong to customer {customer_id}.")
                cur.close()
                con.close()
                return error, 404, {'Access-Control-Allow-Origin': '*'}

            update_string = "UPDATE cards set customer_name=%s, card_number=%s, card_expiry=%s, primary1=%s \
            where id = %s and customer_id = %s RETURNING id;"
            cur.execute(update_string, (body.customer_name, body.card_number, body.card_expiry, body.primary1, card_id, customer_id))
            cust_id = cur.fetchone()[0]
        
        cur.close()
        con.close() 
        return body, 200, {'Access-Control-Allow-Origin': '*'}
        

    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}


def update_customer(customer_id, body=None):  # noqa: E501
    """Update customer

    This can only be done by the logged in customer. # noqa: E501

    :param customer_id: Customer id of a customer
    :type customer_id: str
    :param body: Update an existent customer in the database
    :type body: dict | bytes

    :rtype: Customer
    """

    try:
        if connexion.request.is_json:
            body = Customer.from_dict(connexion.request.get_json())  # noqa: E501
        
        con = psycopg2.connect(database= database, user=user, password=db_password, host=host, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()

        # to check if the customer id exists or not
        cur.execute('SELECT * FROM customers where id = ' + str(customer_id))
        record = cur.fetchone()
        if record == None:
            error = CustomerNotFoundError(code=404, type="CustomerNotFoundError", 
                    message="The following Customer ID does not exist: " + str(customer_id))
            cur.close()
            con.close()
            return error, 404, {'Access-Control-Allow-Origin': '*'}

        if body.email != None:
            cur.execute("SELECT * FROM customers where email = '"+str(body.email.replace("'", "''"))+"' and id !="+str(customer_id)+";")

            record = cur.fetchone()
            if record != None:
                error = InvalidInputError(code=409, type="InvalidInputError", 
                        message="The provided email address already exists in database.")
                cur.close()
                con.close()
                return error, 400, {'Access-Control-Allow-Origin': '*'}

        update_string = "UPDATE customers set "
        update_list = list()

        if body.first_name != None: 
            update_string += " first_name=%s,"
            update_list.append(body.first_name)

        if body.last_name != None: 
            update_string += " last_name=%s,"
            update_list.append(body.last_name)

        if body.email != None: 
            update_string += " email=%s,"
            update_list.append(body.email)

        if body.password != None: 
            update_string += " password=%s,"
            update_list.append(body.password)

        if body.mobile_no != None: 
            update_string += " mobile_no=%s,"
            update_list.append(body.mobile_no)

        if body.location != None: 
            update_string += " location=%s,"
            update_list.append(body.location)

        if body.profile_pic != None: 
            update_string += f" profile_pic='{body.profile_pic}',"

        if body.points != None: 
            update_string += f" points='{body.points}',"

        if update_string != "UPDATE customers set ":
            update_string = update_string[:-1]
            update_string += f" where id = {customer_id} RETURNING id;"
                
            cur.execute(update_string, update_list)
            cust_id = cur.fetchone()[0]

        cur.close()
        con.close()                    
        return body, 200, {'Access-Control-Allow-Origin': '*'}


    except Exception as e:
        # catch any unexpected runtime error and return as 500 error 
        error = UnexpectedServiceError(code="500", type="UnexpectedServiceError", message=str(e))
        return error, 500, {'Access-Control-Allow-Origin': '*'}
