'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var paths = {
	index  : path.join(__dirname, 'view/index.html'),
	stream : path.join(__dirname, 'stream'),
	view   : path.join(__dirname, 'view'),
};

require('./lib/routes.js')(
				express, app,
				paths);

require('./lib/socketdispatch.js')(
				http,
				path.join(paths.stream, 'path.txt'));

http.listen(3000, function () {
	console.log('listening on *:3000');
});


