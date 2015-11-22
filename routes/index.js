var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../tools/dbConfig.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'JeoparDB' });
});

module.exports = router;
