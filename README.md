# Koa Knex Starter

This boilerplate starter repo is meant for simply getting a basic project to a head start. This is very barebones on purpose. To give room for just about any direction a project needs to go. Comes with koa router and knex setup with basic JWT user login. Nothing fancy, just some starter code.

## Dev Features

- HMR'ish like backend dev with `supervisor`
- Koa server
- MySQL with knex.js
- knex.js migrations
- `dontenv` for enviorment variables + simple casting utility `dotend-cast`
- API validation with `yup`
- Auto reload dev env using supervisor (server)
- helmet
- dotEnv + centeralized config frozen global
- Users auth (JWT for now) and password hashing (argon2)
- PM2 for production

## File Structure

```text
├── clients (Put here any frontend clients your project needs)
|   └── Admin (src for quote frontend)
├── commands (ex. deploy scripts)
├── migrations (DB migration scripts)
├── dist (or distrubution/deploy files)
├── node_modules
├── public (static files for serving on the web)
├── server (backend src)
|   ├── middleware
|   ├── models
|   ├── routes
|   ├── utils
|   ├── config.js
|   ├── server.js
|   └── server.js
├── .env (enviorment variables)
├── .env-example (saved to git repo for reference)
├── .gitignore
├── .nvmrc (keeping track of node version being used)
├── .ecosystem.config.cjs (PM2 config)
├── knexfile.js (knex config)
├── package-lock.json
├── package.json
└── README.md
```

## Code Style

Using eslint with [StandardJS](https://standardjs.com/) style configured

## Getting Started

1. Clone this repo

```bash
git clone <ssh or https repo url>
```

2. Create `.env` file

Copy the `.env-example` file to get started and put in your project's values. Then consult the `server/config.js` file and use the `env()` for casting your variables to the types you would like. This file is a central place for your configs and env variables. It is included in the server start up process, and `koa`'s context via `ctx.config`.

***NOTE:*** If you are going to use Login features, make sure to set a `JWT_SECRET` in the `.env` file. This secret can be any string, but the more random the better. Grab a random string from this site [https://www.grc.com/passwords.htm](https://www.grc.com/passwords.htm) or generate it using `openssl rand 64 | base64` command.

3. Set up DB

This uses `mysql2` DB client with MariaDB. But you can use whatever SQL server that `mysql2` npm client supports. This cannot create the database by itself. Therefore, before starting the app, you must have a DB server running with the same database name setup in your `.env` file.

For local dev, I suggest using something like docker for easy setup.

```yml
version: '3.1'

services:

  db:
    image: mariadb
    restart: always
    environment:
      MARIADB_ROOT_PASSWORD: 1234
    ports:
      - "3306:3306"
    volumes:
      - ./.data:/var/lib/mysql

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
```

Once this is saved somewhere on your system (ex `~/docker-services/mariadb`) and up using `docker-compose up -d` then navigate to `http://localhost:8080` to use adminer to interact with your DB server. Or use the DB client of your choice.

4. Install dependencies and start app

```bash
npm i

# Run in development
npm run dev

# Run development and link with chrome browser dev tools for debugging
npm run dev-console

# Run for production (review more below about deploying)
npm run pm2-start
```

```bash
cd client
npm i
npm start
```

## Env Casting Types

A simple util is included to help use the values provided by the `.env` file. Coinfig src for the backend app can be found in `server/config.js` AND allows passing a default value. Using [dotenv-cast](https://www.npmjs.com/package/dotenv-cast).

***Note:*** Will `Throw` if type used cannot be cast to that type. Example (`env.int('NUMBER')` and 'NUMBER' is '33.33' this will throw as this number is a floating point type number.)

```javascript
// string
env('NODE_ENV', 'development') // Trys to find 'NODE_ENV' var but if it cannot or it is empty then it uses 'development'
env.string('NODE_ENV') // same as env()

// Integer
env.int('PORT', 5000) // Is just expected to be a whole number, runs through parseInt()

// Float
env.float('FLOAT_VAR', 23.05) // runs it through parseFloat()

// Number (can be float or integer)
env.num('FLOAT_VAR', 23.05)

// Boolean
env.bool('USE_CACHE', true) // must be 'true' or 'false' in .env file

// JSON
env.json('VAR_OBJ', { msg: 'nothing here' }) // runs it through JSON.parse() so make sure it is a valid JSON string, default is standard js object

// Array
env.array('CATS_VAR', ['Tom', 'Willey']) // in .env file just add '[]' and values separated by commas: ex CATS_VAR=[Victor,Sassy]

// Date
env.date('START_DATE', new Date()) // Just passes it to new Date(var), so must be a valid date string
```

## Deployment

A simple CLI for deploying via rsync if you would like. For set up:

1. First set up the `.env` vars

`SHIP` is intended for your testing/ staging enviornment. Where `SHIP_PROD` is for your production. You would enter the destination path into these values. Since rsync supports `ssh` we can deploy to remote servers easily.

For example:

```bash
SHIP=ssh user@123.123.0.1/path/to/site/html/

# Or if you have a hostname set up in your ~/.ssh/config then you can do something like this:
SHIP=yourhostname:/path/to/site/
```

*NOTE* Also if you have included any extra directories or files outside of the ones this repo starts with and you need them in your deployment then add them to the `BUILD_LIST` array env variable.

2. Run command

```bash
npm run ship
```

It will ask you if you want to `build`, this will copy all of the nessesary files into a `.dist` directory. Almost always answer yes or `y` or just press `enter`.

Then it will ask which `env` you want to ship to, `staging` or `production`. This will correspond to the `.env` variables above.


## Notes

### `@koa/router` notes:

Use `/:splat*` for matching anything on a route. For example with a 404 route:

```javascript
router.get('/:splat*', async ctx => {
  ctx.status = 404
  await ctx.render('page_404')
})
```

## ToDos

- [ ] Set up frontend to login
- [ ] Assess if a default templating engine needs to be added
