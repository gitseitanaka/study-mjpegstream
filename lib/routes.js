'use strict';

module.exports = function(express, app, paths) {

  app.use('/', express.static(paths.stream));
  app.use('/', express.static(paths.view));
  app.get('/', function (req, res) {
    res.sendFile(paths.index);
  });

};
