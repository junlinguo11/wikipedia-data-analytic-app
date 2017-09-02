var mongoose = require('./db')
mongoose.Promise = global.Promise;

var RevisionSchema = new mongoose.Schema(
		{title: String, 
		 timestamp:String, 
		 user:String, 
		 anon:String},
		 {
			 versionKey: false 
		})

RevisionSchema.statics.findMostRevArticle = function(callback){
	
	return this.aggregate([
		{'$group':{_id:'$title', 'count': {$sum:1}}},
		{'$sort':{count:-1}},
		{'$limit':1}],
		callback)
}

RevisionSchema.statics.findLeastRevArticle = function(callback){
	
	return this.aggregate([
		{'$group':{_id:'$title', 'count': {$sum:1}}},
		{'$sort':{count:1}},
		{'$limit':1}],
		callback)
}

RevisionSchema.statics.findArticleWithMostRegisterdUser = function(callback){
	
	return this.aggregate([
		{ '$match': { anon: { '$exists': false }}},
		{'$group': {_id:{"title": '$title', 'user': '$user'}, "count":{'$sum':1}}},
		{'$group': {_id:{"title": '$_id.title'}, "distinct_user_count":{'$sum':1}}},
		{'$sort':{distinct_user_count:-1}},
		{'$limit':1}
		],
		callback)
}

RevisionSchema.statics.findArticleWithLeastRegisterdUser = function(callback){
	
	return this.aggregate([
		{ '$match': { anon: { '$exists': false }}},
		{'$group': {_id:{"title": '$title', 'user': '$user'}, "count":{'$sum':1}}},
		{'$group': {_id:{"title": '$_id.title'}, "distinct_user_count":{'$sum':1}}},
		{'$sort':{distinct_user_count:1}},
		{'$limit':1}
		],
		callback)
}

RevisionSchema.statics.groupByYear = function(callback){
	
	return this.aggregate([
		{ "$project": {year: { "$substr": [ "$timestamp", 0, 4 ]}}},
		{"$group" : {_id:"$year"}}
		],
		callback)
}

RevisionSchema.statics.findAnonNumByYear = function(callback){
	
	return this.aggregate([
		{ "$match" : { anon : { '$exists': true } } },
		{ "$project": {year: { "$substr": [ "$timestamp", 0, 4 ]}}},
		{"$group" : {_id:"$year", count:{"$sum":1}}}
		],
		callback)
}

RevisionSchema.statics.findUserNumByYear = function(callback){
	
	return this.aggregate([
		{ "$match" : { anon : { '$exists': false } } },
		{ "$project": {year: { "$substr": [ "$timestamp", 0, 4 ]}, user:1}},
        {'$group': {_id:{"year": '$year', 'user': '$user'}, "count":{'$sum':1}}}
		],
		callback)
}

RevisionSchema.statics.findMaxAgeArticle = function(callback){
	
	return this.aggregate([
		{"$group" : {_id:'$title', creation:{"$min":"$timestamp"}}},
		{'$sort':{creation:1}},
		{'$limit':1}
		],
		callback)
}

RevisionSchema.statics.findMinAgeArticle = function(callback){
	
	return this.aggregate([
		{"$group" : {_id:'$title', creation:{"$min":"$timestamp"}}},
		{'$sort':{creation:-1}},
		{'$limit':1}
		],
		callback)
}

RevisionSchema.statics.findTitles = function(callback){
	
	return this.aggregate([
		{'$group': {_id:'null', article: {$addToSet: '$title'}}}
		],
		callback)
}

RevisionSchema.statics.findLatestRevisionByTitle = function(title, callback){
	
	return this.aggregate([
		{ "$match" : { title : title } },
		{"$group" : {_id:'$title', latest:{"$max":"$timestamp"}}},
		],
		callback)
}

RevisionSchema.statics.InsertLatestRevisionByTitle = function(new_revisions, callback){
	console.log("execute")
	return this.insertMany(new_revisions, callback)
}

RevisionSchema.statics.findRevNumByTitle = function(title, callback){
	
	return this.aggregate([
		{ "$match" : { title : title } },
		{"$group" : {_id:'$title', count:{"$sum":1}}}
		],
		callback)
}

RevisionSchema.statics.findTopFiveByTitle = function(title, callback){
	
	return this.aggregate([
		{ "$match" : { title : title } },
		{"$group" : {_id:'$user', count:{"$sum":1}}},
		{ "$sort" : { count: -1 }},
		{ "$limit" : 5 }
		],
		callback)
}

RevisionSchema.statics.groupByYearAndTitle = function(title, callback){
	
	return this.aggregate([
		{ "$match" : { title : title } },
		{ "$project": {year: { "$substr": [ "$timestamp", 0, 4 ]}}},
		{"$group" : {_id:"$year"}}
		],
		callback)
}

RevisionSchema.statics.findAnonNumByYearAndTitle = function(title, callback){
	
	return this.aggregate([
		{ "$match" : { title : title } },
		{ "$match" : { anon : { '$exists': true } } },
		{ "$project": {year: { "$substr": [ "$timestamp", 0, 4 ]}}},
		{"$group" : {_id:"$year", count:{"$sum":1}}}
		],
		callback)
}

RevisionSchema.statics.findUserNumByYearAndTitle = function(title, callback){
	
	return this.aggregate([
		{ "$match" : { title : title } },
		{ "$match" : { anon : { '$exists': false } } },
		{ "$project": {year: { "$substr": [ "$timestamp", 0, 4 ]}, user:1}},
        {'$group': {_id:{"year": '$year', 'user': '$user'}, "count":{'$sum':1}}}
		],
		callback)
}

RevisionSchema.statics.findDataTableByTitleByUser = function(title, user, callback){
	
	return this.aggregate([
		{ "$match" : { title : title } },		
		{ "$match" : { user: user} },
		{"$project": {year: { "$substr": [ "$timestamp", 0, 4 ]}}},
		{"$group" : {_id:"$year", count:{"$sum":1}}}
		],
		callback)
}

RevisionSchema.statics.findDataTableOfFiveUserByTitle = function(title, userArray, callback){
	
	return this.aggregate([
		{ "$match" : { title : title } },		
		{ "$match" : {user: {"$in" : userArray}}},
        { "$project": {year: { "$substr": [ "$timestamp", 0, 4 ]}, user:1}},
        {'$group': {_id:{"year": '$year', 'user': '$user'}, "count":{'$sum':1}}}
		],
		callback)
}

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

module.exports = Revision