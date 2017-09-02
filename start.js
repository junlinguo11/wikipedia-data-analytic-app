var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');

var revision = require('./app/routes/revision.server.routes')

var app = express()
	
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', revision)
app.listen(process.env.PORT || 3000, function () {
	console.log('revision app listening on port ' + process.env.PORT || 3000);
})