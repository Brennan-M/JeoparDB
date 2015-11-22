var mysql = require('mysql');
var config = require('./tools/dbConfig.json');
var app = require('./app.js');
var format = require('string-format');

var queryDB = exports = module.exports = {};


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


	var sdSQL;
	if (request.body.startDate == "") {
		sdSQL = undefined;
	} else {
		var startDateArr = request.body.startDate.split("/");
		if (startDateArr.length != 3) {
			sdSQL = undefined;
		} else {
			console.log(request.body.startDate);
			var sdYear = startDateArr[2];
			var sdMonth = startDateArr[0];
			var sdDay = startDateArr[1];
			sdSQL = format("AirDay >= {0} AND AirMonth >= {1} AND AirYear >= {2} ", sdDay, sdMonth, sdYear);
		}
	}


	var edSQL;
	if (request.body.endDate == "") {
		edSQL = undefined;
	} else {
		var endDateArr = request.body.endDate.split("/");
		if (endDateArr.length != 3) {
			edSQL = undefined;
		} else {
			console.log(request.body.endDate);
			var edYear = endDateArr[2];
			var edMonth = endDateArr[0];
			var edDay = endDateArr[1];
			edSQL = format("AirDay < {0} AND AirMonth < {1} AND AirYear < {2} ", edDay, edMonth, edYear);
		}
	}

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
	console.log(fullSQLQuery);

	con.query(fullSQLQuery, function(err, rows) {
	  
	  	if(err) throw err;

	  	if (rows.length == 1) {

	  		var newSQLQuery = format('SELECT * FROM QuestionIds NATURAL JOIN Questions WHERE Category="{0}" AND ShowNumber={1}',
	  	 						 	rows[0]["Category"], rows[0]["ShowNumber"]);

		  	con.query(newSQLQuery, function(err, rows) {
		  		callback(err, rows);
		  		con.end(function(err) { console.log('Connection terminated.') });
		  	});

		} else {
			callback(err, "Empty Result");
		}
	  	
	}); 
};


