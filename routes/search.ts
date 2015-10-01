/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="../typings/request/request.d.ts"/>

import express = require('express');
import request = require('request');
import http    = require('http');
var router     = express.Router();

// GET data from elastic and send response
router.get('/', function(req: express.Request, res: express.Response) {
    request.get('http://localhost:9200/recipesindex/_search?q=_all:' + req.query.q, function (err: any, response: http.IncomingMessage, body: any) {
        if (err) {
            res.send(err);
        } else if (response.statusCode == 200) {
            res.send(body);
        }
    });
});

module.exports = router;