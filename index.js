var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
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
	socket.emit('connected', socket.id);
	console.log("count connected : ", Object.keys(sockets).length);

	socket.on('start-stream', function () {
		startStreaming(io, sockets[socket.id]);
	});

	socket.on('stop-stream', function () {
		stopStreaming(io, sockets[socket.id]);
	});

	socket.on('disconnect', function () {

		if (socket.id in sockets) {
			delete sockets[socket.id];
		}
		if (socket.id in ringPaths) {
			ringPaths[socket.id].stop();
			delete ringPaths[socket.id];
		}
	});

});
http.listen(3000, function () {
	console.log('listening on *:3000');
});


function stopStreaming(aio, aSocket) {
	if (aSocket.id in ringPaths) {
		ringPaths[aSocket.id].stop();
		delete ringPaths[aSocket.id];
	}
}

function startStreaming(aio, aSocket) {
	try {
		var ringPath = RingPath(
			faliename, 100
		);
		ringPaths[aSocket.id] = ringPath;
		console.log("count started : ", Object.keys(ringPaths).length);
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
