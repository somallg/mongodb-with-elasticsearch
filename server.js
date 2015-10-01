/// <reference path="typings/tsd.d.ts"/>
// OpenShift Simple Nodejs application
// Define constants
var PORT = 'port';
var IPADDRESS = 'ipaddress';
var LOCALHOST = '127.0.0.1';
var PORTNUMBER = 3000;
var DEVELOPMENT = 'development';
var ENV = 'env';
var ERROR = 'error';
var NOT_FOUND = 'Not Found';
var STATUS = 'status';
var STATUS_404 = 404;
var STATUS_500 = 500;
var PUBLIC = 'public';
var VIEWS = 'views';
// Define dependencies
var express = require('express');
var path = require('path');
var serveFavicon = require('serve-favicon');
var logger = require('morgan');
// TODO cookieParser
// TODO bodyParser
// routes dependencies
var index = require('./routes/index');
var search = require('./routes/search');
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
app.use(function (req, res, next) {
    var err = new Error(NOT_FOUND);
    err[STATUS] = STATUS_404;
    next(err);
});
// Error handlers
// Development error handler
// will print stacktarce
if (app.get(ENV) === DEVELOPMENT) {
    app.use(function (err, req, res, next) {
        res.status(err.status || STATUS_500);
        res.render(ERROR, {
            message: err.message,
            error: err
        });
    });
}
// Production error handler
// no stacktrace leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || STATUS_500);
    res.render(ERROR, {
        message: err.message,
        error: {}
    });
});
// Start app
app.set(IPADDRESS, process.env.OPENSHIFT_NODEJS_IP || LOCALHOST);
app.set(PORT, process.env.OPENSHIFT_NODEJS_PORT || PORTNUMBER);
var server = app.listen(app.get(PORT), app.get(IPADDRESS), function () {
    console.log('Express server listening on port ' + server.address().port);
});
//# sourceMappingURL=server.js.map