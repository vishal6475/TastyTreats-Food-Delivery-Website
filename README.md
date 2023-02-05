# TastyTreats-Restaurant-Website
This is a project for a restaurant website with both front end and backend services.


## Steps for installation (with Docker):
**Pre-requisites:**
•	Docker
•	Python (version 3+)
•	npm

### Create the initial folder to contain project:
1. Create a folder named 'TastyTreats' on your laptop. This will be your project working directory.
2. Open command prompt terminal and go to the folder 'TastyTreats'.

### Download the project from Github:
3. - Either download the ZIP file for this project from Github and unzip to your working directory 'TastyTreats'. -OR-
   - Run the command `git init` on command prompt terminal to initialize the git repository. Then run the command `git clone git@github.com:vishal6475/TastyTreats-Food-Delivery-Website.git` to download this project and enter your git password.
4. Go to project directory by running command `cd TastyTreats-Restaurant-Website` on terminal.

### Install the dependencies and start the system:
5. Run command `./deploy.sh` to install all the dependencies. It could take 10-15 minutes as postgres and node.js images are downloaded from docker hub. It will also start the backend and frontend services and populate the database.
6. Open the browser and open link http://localhost:3000 to start browsing the TastyTreats website.
7. Run the command `./stop.sh` to shut down all the services.

### Starting and stopping the system:
Once all the dependencies have been installed in step 5, you can start the system by running command `./start.sh` and stop the system by running command `./stop.sh`.


## Steps for installation (without Docker):
**Pre-requisites:**
•	Docker
•	Python (version 3+)
•	PostgreSQL
•	npm

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
8. Run the command `python3 create_db.py` (or `python create_db.py` if python3 is not working) to populate the database.

### Update the settings to run the backend services directly:
9. Ensure that in the below 3 files, the line `host = "localhost"` is not commented (do *NOT* have # before it) and the line `host='tastytreats-db'` is commented (do have the # before it). First line is required only when running the services directly and the second line is required when running the services via Docker.

**Files to check:**  
TastyTreats\TastyTreats-Restaurant-Website\Services\customer-service\python-flask-server\swagger_server\controllers\customers_controller.py
TastyTreats\TastyTreats-Restaurant-Website\Services\store-service\python-flask-server\swagger_server\controllers\orders_controller.py
TastyTreats\TastyTreats-Restaurant-Website\Services\store-service\python-flask-server\swagger_server\controllers\stores_controller.py

**Settings required:**  
host = "localhost"     # when running the service directly from command prompt  
#host='tastytreats-db' # when running the service through Docker

### Start the backend customer service:
10. Open a terminal and go to working directory 'TastyTreats'. 
11. Run the command `cd TastyTreats-Restaurant-Website\Services\customer-service\python-flask-server` to go to customer service folder.
12. Run the command `pip3 install -r requirements.txt` to install the dependencies for this service.
13. Run the command `python3 -m swagger_server` (or `python -m swagger_server`) to start the customer service.

### Start the backend store service:
14. Open a terminal and go to working directory 'TastyTreats'. 
15. Run the command `cd TastyTreats-Restaurant-Website\Services\store-service\python-flask-server` to go to store service folder.
16. Run the command `pip3 install -r requirements.txt` to install the dependencies for this service.
17. Run the command `python3 -m swagger_server` (or `python -m swagger_server`) to start the store service.

### Start the frontend React app:
18. Open a terminal and go to working directory 'TastyTreats'. 
19. Run the command `cd TastyTreats-Restaurant-Website\Frontend\tastytreats-app` to go to React app folder.
20. Run the command `npm install` to install the dependencies for the React app. This could take 10-15 minutes when doing for the first time.
21. Run the command `npm start` to start the frontend React application.
22. Open the browser and open link http://localhost:3000 to start browsing the TastyTreats website.
23. Close all the opened terminals to shut down the system.


## Website working screenshots:
