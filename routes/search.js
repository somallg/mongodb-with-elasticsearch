var express = require('express');
var request = require('request');
var router  = express.Router();

// GET home page
router.get('/', function(req, res) {
    request('http://localhost:9200/recipesindex/_search?q=_all:' + req.query.q, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    });
});

module.exports = router;