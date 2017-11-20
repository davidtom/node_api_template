const express = require('express');
const bodyParser = require('body-parser');
const expressLogging = require('express-logging');
const logger = require('logops');

// const mongoose = require('mongoose');

// Connect to MongoDB through Mongoose
// mongoose.connect('db route', optionsObject);

// Set up Express app
const app = express();

// Middlewares
// Server log
app.use(expressLogging(logger));
// Parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Default all response headers to JSON
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Routes
app.use('/api/v1', require('./routes'));

// Error Handling
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('An error occurred.');
});

module.exports = app;
