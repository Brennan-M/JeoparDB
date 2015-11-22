var question_bank = "../question_bank/JEOPARDY_QUESTIONS1.json";
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


// Populate our TeamScores Database
// var team = { Team : 'Blue', Score : 0 };
// con.query('INSERT INTO TeamScores SET ?', team, function(err,res){
// 	if (err) throw err;
// });

// team = { Team : 'Red', Score : 0 };
// con.query('INSERT INTO TeamScores SET ?', team, function(err,res){
// 	if (err) throw err;
// });


var start = Number(process.argv[2]);
var end = Number(process.argv[3]);
console.log(start, end)
// Populate our Tables with information from our question bank
fs.readFile(question_bank, 'utf8', function (err, data) {

	data = JSON.parse(data); 

	if (end === undefined) {
		end = data.length;
	}

	if (end > data.length) {
		end = data.length;
	}

	console.log("Gathering entries " + start + " through " + end + ".");

	for (var i = start; i < end; i++) {

	    var dateArray = data[i]["air_date"].split("-");
	    var value;

	   	if (data[i]["value"] === null) {
	   		value = 0;
	   	} else {
	   		value = Number(data[i]["value"].substring(1).replace(",", ""));
	   	}
	   	
	   	console.log(i);

	    var showDateInsertion = { ShowNumber : data[i]["show_number"],
	    					  	  AirDay : Number(dateArray[2]),
	    					 	  AirMonth : Number(dateArray[1]),
	    					 	  AirYear : Number(dateArray[0])
	    						}
	    con.query('INSERT IGNORE INTO ShowDates SET ?', showDateInsertion, function(err, res) {
			if (err) throw err;
		});

	    var questionIdInsertion = { QuestionId : i,
	    							Question : data[i]["question"]
	    						  }
		con.query('INSERT INTO QuestionIds SET ?', questionIdInsertion, function(err, res) {
			if (err) throw err;
		});

		var categoriesInsertion = { Category : data[i]["category"],
	     							Cluster : "None"
	     						  }
	    con.query('INSERT IGNORE INTO Categories SET ?', categoriesInsertion, function(err, res) {
			if (err) throw err;
		});
						
	    var questionInsertion = { QuestionId : i,
	    						  Category : data[i]["category"],
	    						  ShowNumber : data[i]["show_number"],
	    						  Answer : Answer = data[i]["answer"],
	    						  Value : value,
	    						  AskedCount : 0,
	    						  CorrectCount : 0
	    						}
		con.query('INSERT INTO Questions SET ?', questionInsertion, function(err, res) {
			if (err) throw err;
		});

	}

	con.end(function(err) {
    	console.log('Connection terminated.');
  	});
});



