/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="../typings/request/request.d.ts"/>
var express = require('express');
var request = require('request');
var router = express.Router();
// GET data from elastic and send response
router.get('/', function (req, res) {
    request.get('http://localhost:9200/recipesindex/_search?q=_all:' + req.query.q, function (err, response, body) {
        if (err) {
            res.send(err);
        }
        else if (response.statusCode == 200) {
            res.send(body);
        }
    });
});
module.exports = router;
//# sourceMappingURL=search.js.map