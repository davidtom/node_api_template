// Library Imports
const app = require('./app');
const http = require('http');
require('dotenv').config();

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

// Helper functions (used above)
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
        console.error('Error: ' + bind + ' requires elevated privileges'.red);
        process.exit(1);
    case 'EADDRINUSE':
        console.error('Error: ' + bind + ' is already in use'.red);
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

// export app for testing
module.exports = app;
