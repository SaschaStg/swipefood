[&larr; Back to README.md](README.md)
<hr/>
# Local Development Environment

To set up your local clone to start developing the backend, you need to perform some tasks.

* Install npm packages (`npm install`)
* Create a local `.env` file
* **(Optional)** Create a local `jwt.secret` file

## Create local `.env` file

You can use this template to create your `.env` file:

```dotenv
DB_HOST=localhost
# Use if not using default port
#DB_PORT=5432
DB_USER=swipefood
DB_PASSWORD=someSooperSecurePassword
DB_NAME=swipefood

# Can use either (direct secret will override file)
JWT_SECRET=<SECRET>
# Could use any file, but *.secret files are ignored by git.
JWT_SECRET_FILE=./jwt.secret

# Can use either (direct key will override file)
SPOONACULAR_API_KEY=<API KEY>
SPOONACULAR_API_KEY_FILE=./spoonacular_api_key.secret

# Enable Demo Endpoint (unset/set to empty string to disable)
DEMO_ENABLED=true
```

## Create local `jwt.secret` file

The filename could be something different if you like (or be a file not in this directory at all). Just remember to
adjust the value in the `.env` file accordingly.  
The content of this file will be used as a symmetric key to sign JWT tokens.

For "inspiration" on what to put in here, you can go to https://randomkeygen.com.
