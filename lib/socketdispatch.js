'use strict';

var streaming = require('./streaming.js');
var sockets = {};

module.exports = function(aHttp, aFileName) {
  var io = require('socket.io')(aHttp);

  io.on('connection', function (socket) {
    sockets[socket.id] = socket;
    socket.emit('connected', socket.id);
    console.log("count connected : ", Object.keys(sockets).length);

    socket.on('start-stream', function () {
      streaming.start(io, sockets[socket.id], aFileName);
    });

    socket.on('stop-stream', function () {
      streaming.stop(io, sockets[socket.id]);
    });

    socket.on('disconnect', function () {
      if (socket.id in sockets) {
        delete sockets[socket.id];
      }
      streaming.delete(io, socket);
      console.log("disconnected now count : ", Object.keys(sockets).length);
    });

  });
};