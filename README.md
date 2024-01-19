# Northcoders News API

A node app that gives you the latest Northcoder news via a PSQL database.

Hosted on : https://nc-news-smxe.onrender.com

# Getting Started

To use this app fork and clone this repo to your computer. Repo can be found at https://github.com/ercrawshaw/nc_news

# Minimum Version Requirements

Node version 20.10.0
PostgreSQL version 8.11.3

# Dependencies

The following dependencies will need to be installed using npm package manager. Use the command ```npm install ``` to install the following:

* dotenv
* express
* pg
* pg-format

# Testing Dependencies

The following testing dependencies will also have needed to be installed:

* supertest
* jest
* jest-extended
* jest-sorted

# Create .env files

Create 2 .env files in the top layer of the folder. These files will be titled and filled with the following:

* .env.test
```PGDATABASE=nc_news_test```

* .env.development
```PGDATABASE=nc_news```

# Seeding Database

To seed the local database setup.sql and then run-seed.js need to be run. To do this use the following commands in this order:

```npm run setup-dbs```

```npm run seed```

# Testing

To run the tests to the database use command

```npm run test```


# Note

An available list of endpoints are available in the endpoints.json file.


