var mysql = require('mysql');
var config = require('./dbConfig.json');
var fs = require('fs');

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

for(var i = 0; i < 10; i++){
	con.query('INSERT INTO Leaderboards (Fullname, Score) VALUES ("EMPTY", 0)', function(err, res) {
		if (err) throw err;
	});
}

con.end(function(err) {
    console.log('Connection terminated.');
});