// Library Imports
const express = require('express');
const bodyParser = require('body-parser');
const expressLogging = require('express-logging');
const logger = require('logops');
const colors = require('colors');
const mongoose = require('mongoose');
require('dotenv').config();

// Global Imports
// Project Imports
const AppError = require('./utils/appError');
const normalizeBody = require('./middlewares/normalizeBody');

// Create constant for Node Environment
const env = process.env.NODE_ENV;

// Set up Express app
const app = express();

// Middlewares
// Server log (don't log during tests)
if (env !== 'test') {
    app.use(expressLogging(logger));
}
// Parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Default all response headers to JSON
app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});
// Normalize/clean specific request data
app.use(normalizeBody);

// Routes
app.use('/api/v1', require('./routes'));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new AppError('Requested URL not found', 404);
    next(err);
});

// Error Logger (don't log errors during tests)
if (env !== 'test') {
    app.use(function(err, req, res, next) {
        console.log(colors.red('Error: ') + err);
        next(err);
    });
}

// Error Handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        status: err.status,
        message: err.message
    });
});

// Connect to Mongo
// Paths will differ between dev/test and prod, so set accordingly
const dbPath = (env === 'production')
    ? process.env.DB_PATH_PROD : process.env.DB_PATH_DEV;

// Db name will differ between dev/prod and test, so set accordingly
const dbName = (env === 'test')
    ? process.env.DB_NAME_TEST : process.env.DB_NAME;

const options = {
    keepAlive: 300000,
    connectTimeoutMS: 30000,
    useMongoClient: true
};

// Set mongoose promise library (added to avoid deprecation warnings)
mongoose.Promise = global.Promise;

const dbURI = dbPath + dbName;
mongoose.connect(dbPath + dbName, options);

// Set up event listeners (exempt in testing environment)
if (env !== 'test') {
    mongoose.connection.on('connected', function() {
        console.log('Mongoose successfully connected to ' + dbURI);
    });

    mongoose.connection.on('error', function(err) {
        console.log(colors.red('ERROR: Mongoose connection error: ' + err));
    });

    mongoose.connection.on('disconnected', function() {
        console.log(colors.red('Mongoose connection disconnected.'));
        throw new Error('Mongoose disconnected');
    });
}

module.exports = app;
