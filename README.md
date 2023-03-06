# TastyTreats-Restaurant-Website
This is a project for a restaurant website with both front end and backend services.


## Steps for installation (with Docker):
**Pre-requisites:**
•	Docker
•	Python (version 3+)
•	npm
•	node

### Create the initial folder to contain project:
1. Create a folder named 'TastyTreats' on your laptop. This will be your project working directory.
2. Open command prompt terminal and go to the folder 'TastyTreats'.

### Download the project from Github:
3. - Either download the ZIP file for this project from Github and unzip to your working directory 'TastyTreats'. -OR-
   - Run the command `git init` on command prompt terminal to initialize the git repository. Then run the command `git clone git@github.com:vishal6475/TastyTreats-Food-Delivery-Website.git` to download this project and enter your git password.
4. Go to project directory by running command `cd TastyTreats-Restaurant-Website` on terminal.

### Install the dependencies and start the system:
5. Run command `.\deploy.sh` to install all the dependencies. It could take 10-15 minutes as postgres and node.js images are downloaded from docker hub. It will also start the backend and frontend services and populate the database.
6. Open the browser and open link http://localhost:3000 to start browsing the TastyTreats website.
7. Run the command `.\stop.sh` to shut down all the services.

### Starting and stopping the system:
Once all the dependencies have been installed in step 5, you can start the system by running command `.\start.sh` and stop the system by running command `.\stop.sh`.


## Steps for installation (without Docker):
**Pre-requisites:**  
•	Python (version 3+)
•	PostgreSQL
•	npm
•	node

If you don't have postgreSQL, you can install it using the instructions given at link (https://commandprompt.com/education/how-to-download-and-install-postgresql/). Please make sure that the postgresql server is running on port **5432**, user is '**postgres**' and the password is '**postgrespw**'. 

### Create the initial folder and download the project from Github:
Follow the steps 1-4 given under section 'Steps for installation (with Docker)' to download the project to working directory 'TastyTreats'.

If your postgreSQL does not have the above mentioned port number, user or password, please update them in the below files. This only needs to be updated in the top section of these files.
- TastyTreats\TastyTreats-Restaurant-Website\Database\create_db.py
- TastyTreats\TastyTreats-Restaurant-Website\Services\customer-service\python-flask-server\swagger_server\controllers\customers_controller.py
- TastyTreats\TastyTreats-Restaurant-Website\Services\store-service\python-flask-server\swagger_server\controllers\orders_controller.py
- TastyTreats\TastyTreats-Restaurant-Website\Services\store-service\python-flask-server\swagger_server\controllers\stores_controller.py

### Initialize the database:
5. Open a terminal and go to working directory 'TastyTreats'. 
6. Run the command `cd TastyTreats-Restaurant-Website\Database` to go to Database folder.
7. Run the command `pip3 install -r requirements.txt` to install the dependencies for the database.
8. Run the command `python3 create_db.py` to populate the database.

### Update the settings to run the backend services directly:
9. Ensure that in the below 3 files, the line `host = "localhost"` is not commented (do *NOT* have # before it) and the line `host='tastytreats-db'` is commented (do have the # before it). First line is required only when running the services directly and the second line is required when running the services via Docker.

**Files to check:**  
TastyTreats\TastyTreats-Restaurant-Website\Services\customer-service\python-flask-server\swagger_server\controllers\customers_controller.py
TastyTreats\TastyTreats-Restaurant-Website\Services\store-service\python-flask-server\swagger_server\controllers\orders_controller.py
TastyTreats\TastyTreats-Restaurant-Website\Services\store-service\python-flask-server\swagger_server\controllers\stores_controller.py

**Settings required-**  
host = "localhost"     # when running the service directly from command prompt  
#host='tastytreats-db' # when running the service through Docker

### Start the backend customer service:
10. Open a terminal and go to working directory 'TastyTreats'. 
11. Run the command `cd TastyTreats-Restaurant-Website\Services\customer-service\python-flask-server` to go to customer service folder.
12. Run the command `pip3 install -r requirements.txt` to install the dependencies for this service.
13. Run the command `python3 -m swagger_server` to start the customer service.

### Start the backend store service:
14. Open a terminal and go to working directory 'TastyTreats'. 
15. Run the command `cd TastyTreats-Restaurant-Website\Services\store-service\python-flask-server` to go to store service folder.
16. Run the command `pip3 install -r requirements.txt` to install the dependencies for this service.
17. Run the command `python3 -m swagger_server` to start the store service.

### Start the frontend React app:
18. Open a terminal and go to working directory 'TastyTreats'. 
19. Run the command `cd TastyTreats-Restaurant-Website\Frontend\tastytreats-app` to go to React app folder.
20. Run the command `npm install` to install the dependencies for the React app. This could take 10-15 minutes when doing for the first time.
21. Run the command `npm start` to start the frontend React application.
22. Open the browser and open link http://localhost:3000 to start browsing the TastyTreats website.
23. Close all the opened terminals to shut down the system.


## Website working screenshots:

Below are the steps and screenshots for using this website.

### Search store and placing store:

First page to enter your delivery address
![image](https://user-images.githubusercontent.com/86712652/216825183-db581144-8b0e-4333-b5cf-ce9e6a0e992c.png)

After entering delivery address, website will show the stores in a 7km radius
![image](https://user-images.githubusercontent.com/86712652/216825657-ab39e379-dda7-48a7-9cf1-567222f9425e.png)

You can search for a particular type of store or select from the categories mentioned.
![image](https://user-images.githubusercontent.com/86712652/216825633-e82dad88-cf83-4af5-a8f6-ebbb38ca9348.png)

Click on a store to see details of that store.
![image](https://user-images.githubusercontent.com/86712652/216825717-5a962141-1a08-4462-8e77-1b873b58b602.png)

Scroll down to see all the available items in the store.
![image](https://user-images.githubusercontent.com/86712652/216825738-c7bdacd9-aaa2-4275-b6a0-0bc1112be986.png)

Click on an item and select quantity to add that item to the cart.
![image](https://user-images.githubusercontent.com/86712652/216825746-a4d1f8bb-71c6-4c73-a561-923f14dc4c9d.png)

After selecting all the items, click on 'Checkout' button to go to next screen.
![image](https://user-images.githubusercontent.com/86712652/216825775-2b53664e-8e25-4df6-880a-aa1bc81adb0e.png)

If the user is not logged in, they will be asked to login or register.
![image](https://user-images.githubusercontent.com/86712652/216825803-66419f96-9b69-46ee-bffa-a49e73fddc93.png)

On the checkout page, user will be shown options to finalize the address and payment details.
![image](https://user-images.githubusercontent.com/86712652/216825963-a87293a4-56bd-497e-95f9-2a5967d2eb6a.png)

Click on address section to enter a new address, edit the current delivery address or select from the saved addresses.
![image](https://user-images.githubusercontent.com/86712652/216825980-f28b689b-5ed3-4646-8849-21d9a2b029f4.png)

You can also edit the current address and delivery instructions.
![image](https://user-images.githubusercontent.com/86712652/216825996-8943c385-e29f-4ea2-b93b-6101dffd8eb0.png)

Click on card section to enter the modal to enter new card details or choose from saved cards.
![image](https://user-images.githubusercontent.com/86712652/216826028-cda65c0f-935f-491d-9d2a-77b676ac38a6.png)

Finally, click on 'Place Order' button to go to the order confirmed page.
![image](https://user-images.githubusercontent.com/86712652/216826049-5ba3cc42-5a2b-4fde-978e-323c7e59f1b4.png)


### Customer account pages:

Account profile page-
![image](https://user-images.githubusercontent.com/86712652/216826133-f500cb0a-a3fa-4c18-a98b-9b1344369ca8.png)

Orders page-
![image](https://user-images.githubusercontent.com/86712652/216826159-40c2534b-3113-4e5a-a04d-f0b05987acba.png)

Addresses page-
![image](https://user-images.githubusercontent.com/86712652/216826205-a26f9d8a-0a61-4375-b6b8-c4da3b8f12ac.png)

Payment/cards page-
![image](https://user-images.githubusercontent.com/86712652/216826238-7618e687-5965-4eba-8cc6-6a6b5b36b18f.png)
