# SwipeFood

## Members

| Name              | Student short | Matriculation Number |
|-------------------|---------------|----------------------|
| Kienhöfer Raphael | rk085         | 41501                |
| Hein Nikola       | nh096         | 41507                |
| Nohl Lisa-Marie   | ln034         | 41499                |
| Schmidt Sascha    | ss532         | 41492                |
| Herold Franziska  | fh112         | 41498                |

## Project Abstract

Swipefood is an App, where recipes are swiped left or right, similar to Tinder, to categorize them as good or bad.
The user's "cookbook" displays all recipes that have been rated positively.
The recipes are fetched from the spoonacular API.
The user can also add his own recipes to the database.

## Usage

To run the application, you first need to create two files in the project root directory:

* `jwt.secret` - This file should contain a secret key for the JWT token generation and can be any string.
* `spoonacular-api-key.secret` - This file should contain the API key for the spoonacular API.  
  You can obtain an API key for free at https://spoonacular.com/food-api/console#Dashboard.

If you want to use the application in demo mode (pre-seeded data will be added to the database), make sure
the `DEMO_ENABLED` environment variable is set (to anything but the empty string) for the backend service in
the `docker-compose.yaml` file:

Once the files are in place, you can start the stack using docker compose:

```shell
docker compose up
```

Open any browser and go to http://localhost to use the frontend.
You can create a new account to start from zero.

If you have `DEMO_ENABLED` set, visit http://localhost/api/demo/init to pre-seed the database.  
This will generate three user accounts, the credentials are returned in the response body in the schema:

```ts
[
    {
        "username": string,
        "password": string,
        "displayName": string
    },
]
```

You can also use the deployed version of the application.  
**Staging:** https://swipefood-staging.mi.kienhoefr.de  
**Production:** https://swipefood.mi.kienhoefr.de

## Testing

### Frontend

The tests are located in:
frontend/src/app/auth/login/login.component.spec.ts
frontend/src/app/theme-toggle/theme-toggle.component.spec.ts

To run them use the following command in the `frontend` directory:

```shell
npm run test
```

### Backend

The CRUD operations for the SwipefoodRecipe entity are tested.

The backend test specifications are located in:
backend/src/recipes/*.spec.ts
backend/test/*.e2e-spec.ts

To run them issue the following commands in the `backend` directory:

```shell
npm run test
npm run test:e2e
```
