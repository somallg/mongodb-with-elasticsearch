/// <reference path="../typings/tsd.d.ts"/>
var express = require('express');
var router = express.Router();
// GET home page
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Home Page | Somallg'
    });
});
module.exports = router;
//# sourceMappingURL=index.js.map