/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="../typings/request/request.d.ts"/>

import express = require('express');
import request = require('request');
import http    = require('http');
var router     = express.Router();

// GET data from elastic and send response
router.get('/', function(req: express.Request, res: express.Response) {
    if (!req.query.q) {
        res.send({'hits': {'hits': []}});
    } else {
        request.get('http://localhost:9200/enronindex/_search?q=_all:' + req.query.q, function (err: any, response: http.IncomingMessage, body: any) {
            if (err) {
                res.status(400).send(err);
            } else if (response.statusCode == 200) {
                res.send(body);
            }
        });
    }
});

module.exports = router;