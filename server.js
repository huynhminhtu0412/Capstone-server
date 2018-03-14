/**
 * Module dependencies.
 */
var app = require('./app');
var http = require('http');
var log4js = require('log4js');
var fs = require('fs');

/**
 * Make a log directory, just in case it isn't there.
 */
try {
    fs.mkdirSync('./logs');
} catch (e) {
    if (e.code != 'EEXIST') {
        console.error("Could not set up log directory, error was: ", e);
        process.exit(1);
    }
}

/**
 * Initialise log4js first, so we don't miss any log messages
 */
log4js.configure('./config/log4js.json');
var logger = log4js.getLogger("server");

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '8765');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function () {
    logger.info('Express server listening on port', port);
});
server.on('error', onError);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}