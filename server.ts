/// <reference path="typings/tsd.d.ts"/>

// OpenShift Simple Nodejs application

// Define dependencies
import express  = require('express');
import path     = require('path');
import favicon  = require('serve-favicon');
import logger   = require('morgan');
// TODO cookieParser
// TODO bodyParser
// routes dependencies
var index       = require('./routes/index');
var search      = require('./routes/search');

// Create app
const app = express();

// Configure template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Configure middleware
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(logger('dev'));
// TODO bodyParser
// TODO cookieParser
// Set up static folder
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', index);
app.use('/search', search);

// Catch 404 and forwarding to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// Error handlers

// Development error handler
// will print stacktarce
if (app.get('env') === 'development') {
    app.use((err: any, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler
// no stacktrace leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Start app
app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);

var server = app.listen(app.get('port'), app.get('ipaddress'), function() {
    console.log('Express server listening on port ' + server.address().port);
});