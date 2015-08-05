'use strict';

module.exports = function(express, app, streamPath, indexPath) {

  app.use('/', express.static(streamPath));
  app.get('/', function (req, res) {
    res.sendFile(indexPath);
  });

};
