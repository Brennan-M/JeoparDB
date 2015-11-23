var question_bank = "../question_bank/JEOPARDY_QUESTIONS1.json";
var mysql = require('mysql');
var config = require('./dbConfig.json');
var format = require('string-format')

var con = mysql.createConnection ({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

var scienceKeywords = ["Scien", "Math", "Engineer", "Cure", "Physics", "Math", "biology", "biologist", "chemist", "chemistry", "theor", "hypothesis", "result", "trial", "animal", "calculus", "trigonometry", "metric", "mammal", "reptile", "primate", "evolution", "nature", "origin", "fruit", "vegetable", "anatom", "anthro", "tech", "space", "software", "chem", "archit", "industry", "oxygen", "carbon", "nitrogen", "zoo", "compute", "algorithm", "health", "fitness", "ology", "PC", "particle", "inventor", "technology", "agric"]
var socialScienceKeywords = ["Leader", "Country", "Century", "America", "Events", "International", "Politic", "Europe", "Africa", "U.S.", "World", "Event", "Senate", "city", "cities", "Senator", "Politic", "Land", "year", "decade", "China", "Events", "National", "Latin America", "Asia", "Represent", "Representative", "President", "Prime Minister", "Politburo", "Parliament", "Congress", "Where", "Welcome", "Weather", "latin", "language", "spanish", "king", "queen", "muslim", "islam", "catholic", "protestant", "WW", "Washington", "New York", "London", "Canada", "Paris", "travel", "religion", "christ", "mosque", "temple", "island", "origin", "capital", "city", "region", "historic", "time", "history", "french", "transportation", "ancient", "bible", "age", "war", "century", "decade", "millennium", "remember", "general", "colonel", "soldier", "battle", "skirmish", "empire", "Jefferson", "lincoln", "adams", "roosevelt", "reagan", "nixon", "foreign", "lang", "Chief", "worship", "ruler", "cabinet", "foreign"]
var wordPlayKeywords = ['"', "Rhyme", "Palindrome", "Onomatopoeia", "_", "Sounds", "Spell", "Word", "Letter", "-", "not this but…", "alphabet", "anagram", "scrambled", "speak", "say", "phrases", "crossword", "familiar", "ends", "starts", "pun", "file under"]
var artKeywords = ["Liter", "Theat", "Film", "Star", "Music", "Novel", "Book", "Art", "Author", "Celeb", "TV", "Television", "Show", "movie", "Musical", "Hits", "Rock", "Writ", "Poet", "Drama", "Composer", "Music Video", "Sport", "classic", "Football", "song", "Who", "Love", "Emotion", "Network", "win", "shakespeare", "ballet", "jazz", "opera", "art", "pop", "tune", "actor", "times", "ballet", "playwright", "entertain", "name", "top", "college", "university", "brand", "image", "sitcom", "pulitzer", "emmy", "oscar", "tony", "award", "food", "prize", "70s", "80s", "90s", "role", "known", "news", "potable", "disney", "elvis", "zodiac", "fashion", "fiction", "vogue", "player", "quot", "singer", "rap", "dine", "Hollywood", "lyric", "line", "paint", "cuisine", "character", "duo", "act"]

var clusters = [scienceKeywords, socialScienceKeywords, wordPlayKeywords, artKeywords];
var clusterNames = {4:"Misc", 0:"Science", 1:"Social Science", 2:"Wordplay", 3:"Art/Pop Culture"};

function determineCluster(Category) {
	Category = Category.toUpperCase();

	if (Category.search(/[0-9]{4}/g) > -1) {
		return clusterNames[1];
	}

	if (Category.search(/'[0-9]{2}/g) > -1) {
		return clusterNames[3];
	}

	var categoryDetermined = 4;

	for (var i = 0; i < clusters.length; i++) {
		for (var j = 0; j < clusters[i].length; j++) {
			if (Category.indexOf((clusters[i][j]).toUpperCase()) > -1) {
				categoryDetermined = i;
				break;
			}
		}
	}
	
	return clusterNames[categoryDetermined];
};


con.connect(function(err) {
	if (err) {
		console.log('Could not connect to Database.');
		return;
	}
	console.log('Connection established.');
});

var SQLQuery = 'SELECT Category FROM Categories;';

con.query(SQLQuery, function(err, rows) {

	for (var i = 0; i < rows.length; i++) {

		var category = rows[i]["Category"];
		var cluster = determineCluster(category);
		category = category.replace(/'/g, "''");

		var updateSQL = format("UPDATE Categories SET Cluster='{0}' WHERE Category='{1}';", cluster, category);
		con.query(updateSQL, function(err, res) {
		 	if (err) throw err;
		});

	}

	con.end(function(err) {
		console.log('Connection terminated.');
	});
});


