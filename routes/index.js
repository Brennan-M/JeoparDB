var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../tools/dbConfig.json');

var con = mysql.createConnection ({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});



/* GET home page. */
router.get('/', function(req, res, next) {
	con.query('SELECT * FROM TeamScores;', function(err, rows) {
	  if(err) throw err;
	  console.log(rows);
	  res.render('index', { Blue:rows[0]["Score"],
	  						Green:rows[1]["Score"],
	  						Red:rows[2]["Score"]
						  });
	}); 
});

module.exports = router;