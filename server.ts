/// <reference path="typings/tsd.d.ts"/>

// OpenShift Simple Nodejs application

// Define constants
const PORT: string        = 'port';
const IPADDRESS: string   = 'ipaddress';
const LOCALHOST: string   = '127.0.0.1';
const PORTNUMBER: number  = 3000;

const DEVELOPMENT: string = 'development';
const ENV: string         = 'env';
const ERROR: string       = 'error';
const NOT_FOUND: string   = 'Not Found';

const STATUS: string      = 'status';
const STATUS_404: number  = 404;
const STATUS_500: number  = 500;

const PUBLIC: string      = 'public';
const VIEWS: string       = 'views';

// Define dependencies
import express      = require('express');
import path         = require('path');
import serveFavicon = require('serve-favicon');
import logger       = require('morgan');
// TODO cookieParser
// TODO bodyParser
// routes dependencies
var index           = require('./routes/index');
var search          = require('./routes/search');

// Create app
var app = express();

// Configure template engine
app.set(VIEWS, path.join(__dirname, VIEWS));
app.set('view engine', 'jade');

// Configure middleware
app.use(serveFavicon(path.join(__dirname, PUBLIC, 'img', 'favicon.ico')));
app.use(logger('dev'));
// TODO bodyParser
// TODO cookieParser
// Set up static folder
app.use(express.static(path.join(__dirname, PUBLIC)));

// Define routes
app.use('/', index);
app.use('/search', search);

// Catch 404 and forwarding to error handler
app.use((req, res, next) => {
    var err = new Error(NOT_FOUND);
    err[STATUS] = STATUS_404;
    next(err);
});

// Error handlers

// Development error handler
// will print stacktarce
if (app.get(ENV) === DEVELOPMENT) {
    app.use((err: any, req, res, next) => {
        res.status(err.status || STATUS_500);
        res.render(ERROR, {
            message: err.message,
            error: err
        });
    });
}

// Production error handler
// no stacktrace leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || STATUS_500);
    res.render(ERROR, {
        message: err.message,
        error: {}
    });
});

// Start app
app.set(IPADDRESS, process.env.OPENSHIFT_NODEJS_IP || LOCALHOST);
app.set(PORT, process.env.OPENSHIFT_NODEJS_PORT || PORTNUMBER);

var server = app.listen(app.get(PORT), app.get(IPADDRESS), function() {
    console.log('Express server listening on port ' + server.address().port);
});