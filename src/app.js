// Library Imports
const express = require('express');
const bodyParser = require('body-parser');
const expressLogging = require('express-logging');
const logger = require('logops');

// Global Imports
// Project Imports
const AppError = require('./utils/appError');

// Set up Express app
const app = express();

// Middlewares
// Server log
app.use(expressLogging(logger));
// Parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Default all response headers to JSON
app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Routes
app.use('/api/v1', require('./routes'));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new AppError('Requested URL not found', 404);
    next(err);
});

// Error Handler
// NOTE: Error-handling middleware always takes four arguments. You must provide four
// arguments to identify it as an error-handling middleware function
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;
