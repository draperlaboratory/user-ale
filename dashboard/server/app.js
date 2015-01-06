/*jshint node:true*/
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);

app.set('port', process.env.VCAP_APP_PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  next();
});
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../dist')));

// Handle Errors gracefully
app.use(function(err, req, res, next) {
	if(!err) return next();
	console.log(err.stack);
	res.json({error: true});
});

// Main App Page
app.get('/', function(req, res) {
	res.render('index');
});

require('./routes/logger')(app);
require('./routes/dashboard')(app);

// start server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
