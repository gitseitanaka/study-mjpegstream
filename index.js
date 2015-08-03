var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

var RingPath = require('study-caddon-echo-string');

var faliename = process.argv[2];

app.use('/', express.static(path.join(__dirname, 'stream')));
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

var sockets = {};
var ringPaths = {};
io.on('connection', function (socket) {
	sockets[socket.id] = socket;

	console.log("Total clients connected : ", Object.keys(sockets).length);
	socket.on('disconnect', function () {
		delete sockets[socket.id];
		if (socket.id in ringPaths) {
			ringPaths[socket.id].stop();
		}
		// no more sockets, kill the stream
		if (Object.keys(sockets).length == 0) {
			app.set('watchingFile', false);

		}
	});
	socket.on('start-stream', function () {
		startStreaming(io, sockets[socket.id]);
	});
	socket.on('stop-stream', function () {
		stopStreaming(io, sockets[socket.id]);
	});
});
http.listen(3000, function () {
	console.log('listening on *:3000');
});
function stopStreaming(aio, aSocket) {
	if (Object.keys(sockets).length == 0) {
		app.set('watchingFile', false);

	}
	if (aSocket.id in ringPaths) {
		ringPaths[aSocket.id].stop();
	}
}
function startStreaming(aio, aSocket) {
	if (app.get('watchingFile')) {
//		return;
	}

	console.log('Watching for changes...');
	app.set('watchingFile', true);

	try {
		var ringPath = RingPath(
			faliename, 100
		);
		ringPaths[aSocket.id] = ringPath;
		ringPath.on('progress',
			function (aId, aName) {
				aSocket.emit('liveStream', aName + '?_t=' + (Math.random() * 100000), aSocket.id + " " + aId);
		});
		ringPath.on('end',
			function (aId) {
				console.log('++++ end ', aId);
				aSocket.emit('liveStopped');
			});
		console.log('*** start', ringPath.start());
	}
	catch(e)
	{
		console.log(e.toString());
	}
}
