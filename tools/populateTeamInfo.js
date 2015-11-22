var mysql = require('mysql');
var config = require('./dbConfig.json');

var con = mysql.createConnection ({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

con.connect(function(err) {
	if (err) {
		console.log('Could not connect to Database.');
		return;
	}
	console.log('Connection established.');
});


// Populate our TeamScores Database
var team = { Team : 'Blue', Score : 1 };
con.query('INSERT INTO TeamScores SET ?', team, function(err,res){
	if (err) throw err;
});

team = { Team : 'Red', Score : 1 };
con.query('INSERT INTO TeamScores SET ?', team, function(err,res){
	if (err) throw err;
});

team = { Team : 'Green', Score : 2 };
con.query('INSERT INTO TeamScores SET ?', team, function(err,res){
	if (err) throw err;
});

con.end(function(err) {
	console.log('Connection terminated.');
});