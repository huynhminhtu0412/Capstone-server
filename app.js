var express = require('express');
var log4js = require('log4js');
var cors = require('cors');

var users_routes = require('./routes/users');
var courses_routes = require('./routes/courses');
var classrooms_routes = require('./routes/classrooms');
var roles_routes = require('./routes/roles');
var permissions_routes = require('./routes/permissions');

var app = express();

/**
 * Setup Postgres
 */

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();


/**
 * Enable CORS for all routes
 */
app.use(cors());

/**
 * Enable the use of body parser to get POST params
 */
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/**
 * Setup routes
 */
app.use('/users', users_routes);
app.use('/courses', courses_routes);
app.use('/classrooms', classrooms_routes);
app.use('/roles', roles_routes);
app.use('/permissions', permissions_routes);

app.use(express.static('public'));

/**
 * Setup logger
 */
var logger = log4js.getLogger("http");
app.use(log4js.connectLogger(logger));

/**
 * Catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Error handlers
 */
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
    .json({
      success: false,
      message: err.message,
      code: err
    });
});

module.exports = app;