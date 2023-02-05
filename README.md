# TastyTreats-Restaurant-Website
This is a project for a restaurant website with both front end and backend

Steps for installation (with Docker):
Pre-requisites:
•	Docker
•	npm

Create the initial folder to contain project:
1. Create a folder named 'TastyTreats' on your laptop. This will be your project working directory.
2. Open command prompt terminal and go to the folder 'TastyTreats'.

Download the project from Github:
3. Either download the ZIP file for this project from Github and unzip to your working directory 'TastyTreats'.
OR Run the command 'git init' to initialize the git repository. Then run the command 'git clone git@github.com:vishal6475/TastyTreats-Food-Delivery-Website.git' to download this project and enter your git password.
4. Go to project directory by running command 'cd TastyTreats-Restaurant-Website' on terminal.

Install the dependencies and start the system:
5. Run command './deploy.sh' to install all the dependencies. It could take 10-15 minutes as postgres and node.js images are downloaded from docker hub. It will also start the backend and frontend services and populate the database.
6. Open the browser and open link http://localhost:3000 to start browsing the TastyTreats website.
7. Run the command './stop.sh' to shut down all the services.

Starting and stopping the system:
Once all the dependencies have been installed in step 5, you can start the system by running command './start.sh' and stop the system by running command './stop.sh'.

Steps for installation (without Docker):
0. If you don't have postgreSQL, install it using the link(https://commandprompt.com/education/how-to-download-and-install-postgresql/). 

1. First, run the create_db.py script in the Database folder to connect to the db and intialize all the tables.

2. Install dependencies from requirements file in Services folder and in each individual services folder


Website working screenshots:
