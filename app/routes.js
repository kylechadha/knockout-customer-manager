module.exports = function(app) {

  // Server Routes
  // ----------------------------------------------
  app.get('*', function(req, res) {
    res.sendfile('./public/views/index.html'); // load our index.html file
  });

};
