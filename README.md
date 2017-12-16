# Node API Template
## Overview
Boilerplate setup for a Node API running Express and MongoDB

## Details
Packages used include:
- [Express](https://www.npmjs.com/package/express) to power the server
- [Mongoose](https://www.npmjs.com/package/mongoose) is used to connect to and simplify interactions with MongoDB
- [bcrypt](https://www.npmjs.com/package/bcrypt) helps you easily hash and verify user passwords
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to issue and verify JWTs for user authorization
- [eslint](https://www.npmjs.com/package/eslint) reports any inconsistencies in your code style
- [dotenv](https://www.npmjs.com/package/dotenv) to manage private environment variables and other secrets

## Set Up
- Fork or clone the repo
- Run `npm install` to install necessary packages
- Create a `.env` file in the main directory to store environment variables you want to keep secret
  - Out of the box, the only required variables are: `DB_PATH_DEV` and `DB_NAME`
  - Recommended defaults for those are:  
    ```
    DB_PATH_DEV=mongodb://localhost:27017/
    DB_NAME=YourDBName
    ```
- Run `npm start` to run the server in the development environment
  - Note any warnings or errors from ESLint (rules can be easily configred in `.eslintrc.json`
  - Note the debugging URL that can be opened in Chrome
- Any changes made to files in the `./src` directory will trigger nodemon to restart the server
