var mysql = require('mysql');
var config = require('./tools/dbConfig.json');
var app = require('./app.js');
var format = require('string-format');

var queryDB = exports = module.exports = {};

queryDB.getLeaders = function(request, callback){
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

	var SQLQuery = format('SELECT Fullname, Score FROM Leaderboards ORDER BY Score DESC Limit 10');
	con.query(SQLQuery, function(err, res) {
		callback(err, res);
	});
}

queryDB.addLeader = function(request, callback){
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

	var SQLQuery = format('INSERT INTO Leaderboards (Fullname, Score) VALUES ("' + request.body.Name + '",' + request.body.Score + ')');
	con.query(SQLQuery, function(err, res) {
		callback(err, res);
	});
}

// BUTTON -> POST REQUEST -> SERVER @ app.js -> CALLS getLeaders() -> PASSES IN callback ->

queryDB.getStats = function(request, callback) {
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

	var SQLQuery = format('Select AskedCount, CorrectCount FROM Questions WHERE QuestionId={0};', request.body.questionId);
	con.query(SQLQuery, function(err, res) {
		callback(err, res);
	});
};


queryDB.update = function(request, callback) {
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

	var SQLQuery = format('UPDATE Questions SET AskedCount = AskedCount + 1 WHERE QuestionId={0};', request.body.questionId);

	con.query(SQLQuery, function(err, res) {
		if (request.body.status == "correct") {
			var SQLQuery = format('UPDATE Questions SET CorrectCount = CorrectCount + 1 WHERE QuestionId={0};', request.body.questionId);
			con.query(SQLQuery, function(err, res) {
				con.end(function(err) { console.log('Connection terminated.') });
				callback(err, "Success");
			});
		} else {
			con.end(function(err) { console.log('Connection terminated.') });
			callback(err, "Success");
		}
	});
};


queryDB.updateGlobalScores = function(request, callback) {
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

	var SQLQuery = format('UPDATE TeamScores SET Score = Score + {0} WHERE Team = "{1}";', request.body.score, request.body.team);
	console.log(SQLQuery);
	con.query(SQLQuery, function(err, res) {
		
		con.end(function(err) { console.log('Connection terminated.') });
		callback(err, "Success");
	
	});
};


queryDB.query = function(request, callback) {
	
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

	console.log(request.body);

	var sdSQL;
	if (request.body.startDate == "") {
		sdSQL = undefined;
	} else {
		// var startDateArr = request.body.startDate.split("/");
		// console.log(startDateArr);
		// if (startDateArr.length != 3) {
		// 	sdSQL = undefined;
		// } else {
		// 	var sdYear = startDateArr[2];
		// 	var sdMonth = startDateArr[0];
		// 	var sdDay = startDateArr[1];
		sdSQL = format("AirYear >= {0} ", request.body.startDate);
		// }
	}


	var edSQL;
	if (request.body.endDate == "") {
		edSQL = undefined;
	} else {
		// var endDateArr = request.body.endDate.split("/");
		// if (endDateArr.length != 3) {
		// 	edSQL = undefined;
		// } else {
		// 	var edYear = endDateArr[2];
		// 	var edMonth = endDateArr[0];
		// 	var edDay = endDateArr[1];
		edSQL = format("AirYear <= {0} ", request.body.endDate);
		// }
	}

	console.log(sdSQL, edSQL);

	var cluster;
	if (request.body.cluster == "") {
		cluster = undefined;
	} else {
		cluster = format("Cluster = '{0}' ", request.body.cluster);
	}

	var fullSQLQuery = 'Select Category, ShowNumber FROM QuestionIds NATURAL JOIN Questions\
			   NATURAL JOIN ShowDates NATURAL JOIN Categories ';


	if (sdSQL !== undefined || edSQL !== undefined || cluster !== undefined) {
		fullSQLQuery = fullSQLQuery.concat("WHERE ");
	}

	var andNeeded = false;

	if (sdSQL !== undefined) {
		if (andNeeded == true) {
			fullSQLQuery = fullSQLQuery.concat("AND ");
		} else {
			andNeeded = true;
		}
		fullSQLQuery = fullSQLQuery.concat(sdSQL);
	}

	if (edSQL !== undefined) {
		if (andNeeded == true) {
			fullSQLQuery = fullSQLQuery.concat("AND ");
		} else {
			andNeeded = true;
		}
		fullSQLQuery = fullSQLQuery.concat(edSQL);
	}

	if (cluster !== undefined) {
		if (andNeeded == true) {
			fullSQLQuery = fullSQLQuery.concat("AND ");
		} else {
			andNeeded = true;
		}
		fullSQLQuery = fullSQLQuery.concat(cluster);
	}

	fullSQLQuery = fullSQLQuery.concat("ORDER BY RAND() LIMIT 1");
	fullSQLQuery = fullSQLQuery.concat(";");

	con.query(fullSQLQuery, function(err, rows) {
	  
	  	if (err) {
	  		con.end(function(err) { console.log('Connection terminated.') });
	  		throw err;
	  	}

	  	if (rows.length == 1) {

	  		var category = rows[0]["Category"];
	  		category = category.replace(/'/g, "''");
	  		var newSQLQuery = format("SELECT * FROM QuestionIds NATURAL JOIN Questions NATURAL JOIN Categories NATURAL JOIN ShowDates WHERE Category='{0}' AND ShowNumber={1};",
	  	 						 	category, rows[0]["ShowNumber"]);

	  		console.log(newSQLQuery);
		  	con.query(newSQLQuery, function(err, rows) {
		  		callback(err, rows);
		  		con.end(function(err) { console.log('Connection terminated.') });
		  	});

		} else {
			callback(err, "Empty Result");
		}
	  	
	}); 
};


