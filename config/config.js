require('dotenv').config();
module.exports = {
    "development": {
        "username": process.env.DEV_DB_USERNAME,
        "password": process.env.DEV_DB_PASSWORD,
        "database": process.env.DEV_DB_DATABASE,
        "host": process.env.DEV_DB_HOST,
        "dialect": process.env.DEV_DB_CONNECTION,
        "sync": {
            "force": true
        }
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": process.env.PRD_DB_USERNAME,
        "password": process.env.PRD_DB_PASSWORD,
        "database": process.env.PRD_DB_DATABASE,
        "host": process.env.PRD_DB_HOST,
        "dialect": process.env.PRD_DB_CONNECTION
    }
}
