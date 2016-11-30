'use strict';

var express = require('express');
var morgan = require('morgan');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(morgan('dev')); // log every request to the console
app.disable('x-powered-by'); // reduce chances of Express-specific attacks

// static file serve
app.use(express.static('public'));
app.use(express.static('dist'));
// not found in static files, so default to index.html
app.use(function (req, res) {
	console.log('__dirname', __dirname);
	res.sendFile(__dirname + '/index.html');
});

app.listen(app.get('port'), function () {
	console.log('Listening on port', app.get('port'));
});