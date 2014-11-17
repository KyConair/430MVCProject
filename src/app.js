//import libraries 
var path = require('path'); 
var express = require('express');  
var compression = require('compression');  
var favicon = require('serve-favicon'); 
var cookieParser = require('cookie-parser'); 
var bodyParser = require('body-parser'); 
var mongoose = require('mongoose'); 
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// Database stuff
var dbURL = process.env.MONGOHQ_URL || "mongoDB://localhost/ServerKiller";
var db = mongoose.connect(dbURL, function(err) {
	if(err) {
		console.log("Failed to connect to database");
		throw err;
	}
});

// Include our router
var router = require('./router.js');

// Using express, start building the server
var server;
var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = express();
app.use('/assets', express.static(path.resolve(__dirname+'../client/'))); 
app.use(compression());

// Not 100% sure what is happening here, and definitely not why
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	store: new RedisStore(),
	secret: 'This is my secret',
	resave: true,
	saveUninitialized: true
}));

// Inform the program what langauge the views are in and where to find them
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(favicon(__dirname + '/../client/img/favicon.png')); 
app.use(cookieParser());

// Now throw what we just made to the router
router(app);

// and try to start the server
server = app.listen(port, function(err) {
	if(err) {
		throw err;
	}
	console.log('Server is now listening on port #' + port);
});