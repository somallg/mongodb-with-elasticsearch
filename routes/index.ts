/// <reference path="../typings/tsd.d.ts"/>

import express = require('express');
var    router  = express.Router();

// GET home page
router.get('/', function(req: express.Request, res: express.Response) {
    res.render('index', {
        title: 'Home Page | Somallg'
    });
});

module.exports = router;