// Library Imports
const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config(); // configure dotenv to import data from .env to process.env

// Global Imports
// Project Imports

// Create constant for Node Environment
const env = process.env.NODE_ENV;

// Get port from ENV and store in express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Set up event handlers for server
server.listen(port);
server.on('error', onServerError);
server.on('listening', onServerListening);

// Specify MongoDB database path, name and connection options
const dbPath = (process.env.NODE_ENV === 'production')
    ? process.env.DB_PATH_PROD : process.env.DB_PATH_DEV;

const dbName = process.env.DB_NAME;

const options = {
    keepAlive: 300000,
    connectTimeoutMS: 30000,
    useMongoClient: true
};

// Connect to MongoDB through Mongoose
const dbURI = dbPath + dbName;
mongoose.connect(dbPath + dbName, options);

// Set up event handlers for MongoDB connection
mongoose.connection.on('connected', onMongooseConnected);
mongoose.connection.on('error', onMongooseError);
mongoose.connection.on('disconnected', onMongooseDisconnected);

// Helper functions (used above)
// -----------------------------
// Express Functions
// Normalize a port into a number, string or false
function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

// Callback for errors
function onServerError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // Provide port type in any error messages provided
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // Handle specific errors
    switch (error.code) {
    case 'EACCES':
        console.error('Error: ' + bind + ' requires elevated privileges');
        process.exit(1);
    case 'EADDRINUSE':
        console.error('Error: ' + bind + ' is already in use');
        process.exit(1);
    default:
        throw error;
    }
};

// Callback for listening
function onServerListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    console.log('Running in environment: ' + env);
    console.log(`The server is listening on ${bind}\n`);
};

// Mongoose Functions
// Connection Success
function onMongooseConnected() {
    console.log('Mongoose successfully connected to ' + dbURI);
};

// Connection Error
function onMongooseError(err) {
    console.log('ERROR: Mongoose connection error: ' + err);
};

// Connection is disconnected
function onMongooseDisconnected () {
    console.log('Mongoose connection disconnected');
};
