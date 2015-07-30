var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

var RingPath = require('study-caddon-echo-string');

var faliename = process.argv[2];


//var spawn = require('child_process').spawn;
//var proc;

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
		ringPaths[socket.id].stop();

		// no more sockets, kill the stream
		if (Object.keys(sockets).length == 0) {
			app.set('watchingFile', false);
//			if (proc) proc.kill();
//			fs.unwatchFile('./stream/image_stream.jpg');
		}
	});
	socket.on('start-stream', function () {
		startStreaming(io, sockets[socket.id]);
	});
});
http.listen(3000, function () {
	console.log('listening on *:3000');
});
function stopStreaming() {
	if (Object.keys(sockets).length == 0) {
		app.set('watchingFile', false);
//		if (proc) proc.kill();
		//fs.unwatchFile('./stream/image_stream.jpg');
	}
}
function startStreaming(aio, aSocket) {
	if (app.get('watchingFile')) {
		// Emits an event to all connected clients.
		// This "emit" is because has server(io).
//		io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
//		return;
	}
//	var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];
//	proc = spawn('raspistill', args);
	console.log('Watching for changes...');
	app.set('watchingFile', true);
//	fs.watchFile('./stream/image_stream.jpg', function (current, previous) {
		//io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
//	});

	try {
		var ringpath = RingPath(
			faliename, 1000
		);
		ringPaths[aSocket.id] = ringpath;
		ringpath.on('progress',
			function (aId, aName) {
			//aio.to(aSocket.id).json.emit('liveStream', aName + '?_t=' + (Math.random() * 100000));
				aSocket.emit('liveStream', aName + '?_t=' + (Math.random() * 100000));
		});
		ringpath.on('end',
			function (aId) {
				console.log('++++ end ', aId);
			});
		console.log('*** start', ringpath.start());
	}
	catch(e)
	{
		console.log(e.toString());
	}

}
