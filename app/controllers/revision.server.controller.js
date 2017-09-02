var Revision = require("../models/revision")
var fs = require("fs");
var request = require('request');
var async = require('async');

function getMostRev(callback){
	Revision.findMostRevArticle(function(err,result){
		
		if (err){
			console.log("Cannot find the article with the most number of revisions !")
		}else{
			let mostRevArticle = result[0]._id + " (" + result[0].count +")"
			callback(null, mostRevArticle);
		}	
	})
}
function getLeastRev(callback){	
	Revision.findLeastRevArticle(function(err,result){		
		if (err){
			console.log("Cannot find the article with the least number of revisions!")
		}else{
			let leastRevArticle = result[0]._id + " (" + result[0].count +")"
			callback(null, leastRevArticle);
		}	
	})
}

function getArticleWithMostRegisterdUser(callback){	
	Revision.findArticleWithMostRegisterdUser(function(err,result){		
		if (err){
			console.log("Cannot find the article edited by largest group of registered users!")
		}else{
			let mostRegisterdUserArticle = result[0]._id.title + " (" + result[0].distinct_user_count +")"
			callback(null, mostRegisterdUserArticle);
		}	
	})
}

function getArticleWithLeastRegisterdUser(callback){	
	Revision.findArticleWithLeastRegisterdUser(function(err,result){		
		if (err){
			console.log("Cannot find the article edited by smallest group of registered users!")
		}else{
			let leastRegisterdUserArticle = result[0]._id.title + " (" + result[0].distinct_user_count +")"
			callback(null, leastRegisterdUserArticle);
		}	
	})
}

function getArticleWithLongestHistory(callback){	
	Revision.findMaxAgeArticle(function(err,result){
		if (err){
			console.log("Cannot find the article with the longest history!")
		}else{
			var timestamp = new Date(result[0].creation);
			var ageDate = new Date(Date.now() - timestamp.getTime());
			var age = Math.abs(ageDate.getUTCFullYear() - 1970);
			var maxAgeArticle = result[0]._id + " (" + age + ")";
		    callback(null, maxAgeArticle);
		}
	})
}

function getArticleWithShortestHistory(callback){	
	Revision.findMinAgeArticle(function(err,result){
		if (err){
			console.log("Cannot find the article with the shortest history!")
		}else{
			var timestamp = new Date(result[0].creation);
			var ageDate = new Date(Date.now() - timestamp.getTime());
			var age = Math.abs(ageDate.getUTCFullYear() - 1970);
			var minAgeArticle = result[0]._id + " (" + age + ")";
			callback(null, minAgeArticle);
		}
	})
}

function getOverallDataTable(callback){	
	Revision.groupByYear(function(err,result){		
		if (err){
			console.log("Error: groupByYear")
		}else{
			var dataTable = [];
			var userTable = [['Administrator', 0], ['Anonymous', 0], ['Bot', 0], ['Regular user', 0]];
			var adminUser = fs.readFileSync("./txt/admin.txt", "utf-8").split("\n");
			var botUser = fs.readFileSync("./txt/bot.txt", "utf-8").split("\n");
			for (var i =0; i<result.length;i++){
				year = result[i]._id;
				var yearExist = 0;
				for (var j =0; j<dataTable.length;j++){
					if (dataTable[j][0] == year){
						yearExist = 1;
					}
				}
				if (yearExist == 0){
					dataTable.push([year, 0, 0, 0, 0]);
				}
			}
			Revision.findAnonNumByYear(function(err,result){
				if (err){
					console.log("Error: findAnonNumByYear")
				}else{
					for (var i =0; i<result.length;i++){
						year = result[i]._id;
						anon = result[i].count;
						for (var j = 0; j<dataTable.length;j++) {
							if (year == dataTable[j][0]) {
								dataTable[j][2] += anon;
								userTable[1][1]+=anon;
							}
						}
					}
					Revision.findUserNumByYear(function(err,result){
						if (err){
							console.log("Error: findUserNumByYear")
						}else{
							for (var i =0; i<result.length;i++){
								year = result[i]._id;
								for (var i =0; i<result.length;i++){
									year = result[i]._id.year;
									for (var j =0; j<dataTable.length;j++){
										if (year == dataTable[j][0]){
											user = result[i]._id.user;
											count = result[i].count;
											if (adminUser.indexOf(user) > -1){
												dataTable[j][1]+=count;
												userTable[0][1]+=count;
											}
											else if (botUser.indexOf(user) > -1){
												dataTable[j][3]+=count;
												userTable[2][1]+=count;
											}
											else {
												dataTable[j][4]+=count;
												userTable[3][1]+=count;
											}
										}
									}
								}
							}
							dataTable.sort();
							dataTable.unshift(['Year', 'Administrator', 'Anonymous', 'Bot', 'Regular user']);
							userTable.unshift(['User type', 'Revision number']);
							let overallBarChart = dataTable;
							let overallPieChart = userTable;
							callback(null, overallBarChart, overallPieChart);
						}
					})
				}
			})
		}	
	})
}

module.exports.renderOverallResults = function(req, res) {
	async.parallel([
		getMostRev,
		getLeastRev,
		getArticleWithMostRegisterdUser,
		getArticleWithLeastRegisterdUser,
		getArticleWithLongestHistory,
		getArticleWithShortestHistory,
		getOverallDataTable
	],
	function(err, result) {
		res.render('../app/views/overallStatistics.pug',{
			maxRevisionArticle: result[0], 
			minRevisionArticle: result[1],
			maxRegisteredUserArticle: result[2],
			minRegisteredUserArticle: result[3],
			maxAgeArticle: result[4],
			minAgeArticle: result[5],
			overallBarChart: result[6][0], 
			OverallPieChart: result[6][1]})
	});
}

module.exports.getTitles = function(req, res, next) {
	Revision.findTitles(function(err,result){
		if (err){
			console.log("Error: getTitles")
		}else{
			var titles = result[0].article;
			titles.sort();
			req.titles = titles;
			next();
		}
	})
}

module.exports.renderTitles = function(req, res) {
	res.render('../app/views/index.pug',{
		titles: req.titles})
}

// function getTitle(req, res) {
// 	return title = req.body.title
// }

function getLatestRevisionByTitle(title, callback) {
	Revision.findLatestRevisionByTitle(title, function(err,result){
		if (err){
			console.log("Error: getLatestRevisionByTitle")
		}else{
			var latestRevisionTime = new Date(result[0].latest);
			var ONE_DAY = 24 * 60 * 60 * 1000;
			if (((new Date) - latestRevisionTime) < ONE_DAY){
				var msg = "The revision of article \"" + title +"\" is up to date";
				callback(null, msg);
			}
			else{
				latestRevisionTime.setSeconds(latestRevisionTime.getSeconds() + 1);
				var latestISOTime = latestRevisionTime.toISOString();
				request('https://en.wikipedia.org/w/api.php?action=query&prop=revisions&continue=&titles=' + title + '&rvprop=sha1%7Ctimestamp%7Cparsedcomment%7Cids%7Cuser%7Csize&rvlimit=max&rvstart=' + latestISOTime + '&format=json', function (error, response, body) {
				    if (!error && response.statusCode == 200) {
				      var info = JSON.parse(body)
				    }
				    pageID = Object.keys(info.query.pages)[0];
				    new_revisions = info.query.pages[pageID].revisions
				   // console.log(new_revisions);
				    if (new_revisions != undefined) {
					    for (var i = 0; i < new_revisions.length; i++) {
					    	new_revisions[i].title = title;
					    }
					    Revision.InsertLatestRevisionByTitle(new_revisions, function(err,result){
					    	if (err){
								console.log("Error: getLatestRevisionByTitle")
							}else{
								var msg = result.length + " new revisions have been added!";
								callback(null, msg);
							}
					    })
				    }
				    else {
				    	var msg = "Article has no new revision to be downloaded"
						callback(null, msg);
				    }
				 });
			}
		}
	})
}

function getRevisionNumByTitle(title, callback) {
	Revision.findRevNumByTitle(title, function(err,result){
		if (err){
			console.log("Error: getRevisionNumByTitle")
		}else{
			let totalNumOfRevisions = result[0].count;
			callback(null, totalNumOfRevisions, title);
		}
	})
}

function getTopFiveByTitle(title, callback) {
	var topFive = []
	Revision.findTopFiveByTitle(title, function(err,result){
		if (err){
			console.log("Error: getTopFiveByTitle")
		}else{
			for (var i = 0; i < result.length; i++){
				topFive.push({"index": i + 1, "user": result[i]._id, "count":result[i].count});
			}
			callback(null, topFive);
		}
	})
}

function getIndividualDataTable(title, callback){
	Revision.groupByYearAndTitle(title, function(err,result){		
		if (err){
			console.log("Error: getIndividualDataTable")
		}else{
			var dataTable = [];
			var userTable = [['Administrator', 0], ['Anonymous', 0], ['Bot', 0], ['Regular user', 0]];
			var adminUser = fs.readFileSync("./txt/admin.txt", "utf-8").split("\n");
			var botUser = fs.readFileSync("./txt/bot.txt", "utf-8").split("\n");
			for (var i =0; i<result.length;i++){
				year = result[i]._id;
				var yearExist = 0;
				for (var j =0; j<dataTable.length;j++){
					if (dataTable[j][0] == year){
						yearExist = 1;
					}
				}
				if (yearExist == 0){
					dataTable.push([year, 0, 0, 0, 0]);
				}
			}
			Revision.findAnonNumByYearAndTitle(title, function(err,result){
				if (err){
					console.log("Error: findAnonNumByYearAndTitle")
				}else{
					for (var i =0; i<result.length;i++){
						year = result[i]._id;
						anon = result[i].count;
						for (var j = 0; j<dataTable.length;j++) {
							if (year == dataTable[j][0]) {
								dataTable[j][2] += anon;
								userTable[1][1]+=anon;
							}
						}
					}
					Revision.findUserNumByYearAndTitle(title, function(err,result){
						if (err){
							console.log("Error: findUserNumByYearAndTitle")
						}else{
							for (var i =0; i<result.length;i++){
								year = result[i]._id;
								for (var i =0; i<result.length;i++){
									year = result[i]._id.year;
									for (var j =0; j<dataTable.length;j++){
										if (year == dataTable[j][0]){
											user = result[i]._id.user;
											count = result[i].count;
											if (adminUser.indexOf(user) > -1){
												dataTable[j][1]+=count;
												userTable[0][1]+=count;
											}
											else if (botUser.indexOf(user) > -1){
												dataTable[j][3]+=count;
												userTable[2][1]+=count;
											}
											else {
												dataTable[j][4]+=count;
												userTable[3][1]+=count;
											}
										}
									}
								}
							}
							dataTable.sort();
							dataTable.unshift(['Year', 'Administrator', 'Anonymous', 'Bot', 'Regular user']);
							userTable.unshift(['User type', 'Revision number']);
							let individualBarChart = dataTable;
							let individualPieChart = userTable;
							callback(null, individualBarChart, individualPieChart);
						}
					})
				}
			})
		}	
	})
}

module.exports.renderIndividualResults = function(req, res) {
	let title = req.body.title;
	async.parallel([
		getLatestRevisionByTitle.bind(null, title),
		getRevisionNumByTitle.bind(null, title),
		getTopFiveByTitle.bind(null, title),
		getIndividualDataTable.bind(null, title),
	],
	function(err, result) {
	res.render('../app/views/individualStatistics.pug',{
		msg: result[0],
		totalNumOfRevisions: result[1][0],
		title: result[1][1],
		topFive: result[2],
		individualBarChart: result[3][0],
		individualPieChart: result[3][1],
		})
	});
}

module.exports.getDataTableByTitleByUser = function(req, res, next) {
	title = req.body.title
	user = req.body.user;
	var dataTable = [];
	Revision.findDataTableByTitleByUser(title, user, function(err,result){
		if (err){
			console.log("Error: getDataTableByTitleByUser")
		}else{
			for(var i = 0; i < result.length; i++){
				dataTable.push([result[i]._id, result[i].count]);
			}
			dataTable.sort();
			dataTable.unshift(['Year', 'Revision number']);
			console.log(dataTable);
			req.userBarChart = dataTable;
			req.title = title;
			req.user = user;
			next();
		}
	})
}

module.exports.renderUserChart = function(req, res) {
	res.render('../app/views/userBarChart.pug',{
		userBarChart:req.userBarChart,
		title:req.title,
		user: req.user})
}

module.exports.getDataTableOfFiveUserByTitle = function(req, res, next){
	title = req.body.title
	var topFive = []
	var dataTable = []
	Revision.findTopFiveByTitle(title, function(err,result){
		if (err){
			console.log("Error: getTopFiveByTitle")
		}else{
			for (var i = 0; i < result.length; i++){
				topFive.push(result[i]._id)
			}
			Revision.findDataTableOfFiveUserByTitle(title, topFive, function(err,result){
				if (err){
					console.log("Error: getDataTableByTitleByUser")
				}else{
					for(var j = 0; j < result.length; j++){
						//dataTable.push([result[i]._id, result[i].count]);
						year = result[j]._id.year;
						user = result[j]._id.user;
						count = result[j].count;
						var yearExist = 0;
						for (var k =0; k<dataTable.length;k++){
							if (dataTable[k][0] == year){
								dataTable[k][topFive.indexOf(user) + 1] = count;
								yearExist = 1;
							}
						}
						if (yearExist == 0){
							dataTable.push([year, 0, 0, 0, 0, 0]);
							dataTable[dataTable.length - 1][topFive.indexOf(user) + 1] = count;
						}
					}
					dataTable.sort();
					topFive.unshift('Year');
					dataTable.unshift(topFive);
					console.log(dataTable);
					req.fiveUserBarChart = dataTable;
					req.title = title;
					next();
				}
			})
		}
	})
}

module.exports.renderFiveUserChart = function(req, res) {
	res.render('../app/views/fiveUserBarChart.pug',{
		fiveUserBarChart:req.fiveUserBarChart,
		title:req.title})
}
