'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');

var stream_path = path.join(__dirname, 'stream');

require('./lib/routes.js')(
				express, app,
				stream_path, __dirname + '/index.html');

require('./lib/socketdispatch.js')(
				http,
				path.join(stream_path, 'path.txt'));

http.listen(3000, function () {
	console.log('listening on *:3000');
});


