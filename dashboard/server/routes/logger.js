//Demo
var mongojs = require("mongojs");
db = mongojs.connect("xdata", ["logs", "sessions", "feedback"]);

module.exports = function(app){
	app.post('/send_log', function(req, res){
		console.log('Received log');
		// Allow CORS
	  var origin = (req.headers.origin || "*");
	  res.header("Access-Control-Allow-Origin", origin);

		var data = req.body;
    
	  data.timestamp = new Date(data.timestamp)
	  db.logs.insert(data, function (err, result) {
	    res.json({});
			res.end()
	  });
	});

  // app.post('/logger', function(req, res){
  //   console.log('Received logs');
  //   // Allow CORS
  //   var origin = (req.headers.origin || "*");
  //   res.header("Access-Control-Allow-Origin", origin);

  //   var data = req.body;
    
  //   data.timestamp = new Date(data.timestamp)
  //   db.logs.insert(data, function (err, result) {
  //     res.json({});
  //     res.end()
  //   });
  // });

	app.get('/register', function(req, res){
  	console.log('Registering Session', req.connection.remoteAddress);

  	// Allow CORS
    var origin = (req.headers.origin || "*");
    res.header("Access-Control-Allow-Origin", origin);

  	var client_ip = req.connection.remoteAddress
    var data = {client_ip: client_ip};

    db.sessions.insert(data, function (err, result) {

    	res.json({
  			session_id: result._id,
  			client_ip: req.connection.remoteAddress
  		})
      res.end()
  	})
  });
}