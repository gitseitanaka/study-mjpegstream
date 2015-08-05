'use strict';

var stringEcho = require('study-caddon-echo-string');

var streaming = {
  ringPaths:{}
};

streaming.stop = function(aIo, aSocket) {
  if (aSocket.id in streaming.ringPaths) {
    streaming.ringPaths[aSocket.id].stop();
    delete streaming.ringPaths[aSocket.id];
  }
};

streaming.delete = function(aIo, aSocket) {
  if (aSocket.id in streaming.ringPaths) {
    streaming.ringPaths[aSocket.id].stop();
    delete streaming.ringPaths[aSocket.id];
  }
};

streaming.start = function(aIo, aSocket, aFileName, aInterval) {
  try {
    var interval = aInterval;
    var ringPath = stringEcho(
      aFileName, interval
    );
    streaming.ringPaths[aSocket.id] = ringPath;
    console.log("count started : ", Object.keys(streaming.ringPaths).length);
    ringPath.on('progress',
      function (aId, aName) {
        var url =  aName + '?_t=' + (Math.random() * 100000);
        aSocket.emit('liveStream', url, aSocket.id + " " + aId);
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
    console.log('@@@ exception :', e.toString());
  }
};

module.exports = streaming;
