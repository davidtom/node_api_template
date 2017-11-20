const app = require('./app');
var http = require('http');

// Store NODE_ENV as constant
const env = process.env.NODE_ENV;

// Get port from ENV and store in express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Set up event handlers for server
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Helper functions (used above)
// Normalize a port into a number, string or false
function normalizePort(val) {
    let port = parseInt(val, 10);

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
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // Provide port type in any error messages provided
    var bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

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
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    console.log('Running in environment: ' + env);
    console.log(`The server is listening on ${bind}`);
};
