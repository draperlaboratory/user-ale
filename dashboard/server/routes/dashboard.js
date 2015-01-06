//Dashboard endpoints
var mongojs = require("mongojs");
db = mongojs.connect("xdata", ["logs", "sessions", "feedback"]);

// http://docs.mongodb.org/manual/reference/operator/aggregation/cond/
module.exports = function(app){
	app.get('/sessions', function(req, res){
    // Allow CORS
    var origin = (req.headers.origin || "*");
    res.header("Access-Control-Allow-Origin", origin);

		var query = [{$group: {
	    '_id':'$sessionID',
	    'component': {'$min': '$component.name'},
	    'user': {'$min': '$client'},
	    'start': {'$min': '$timestamp'},
	    'stop': {'$max': '$timestamp'},
	    nLogs: {'$sum': 1},
	    nUserLogs: { $sum: 
	    	{ $cond: 
	    		[{ $eq: [ "$type", "USERACTION" ] } , 1, 0] 
	    	} 
	    }
	  }}
	  ];
		if (req.params.id) {
			var match = [{$match: {sessionID: req.params.id}}];
			query = match.concat(query);
		}

	  db.logs.aggregate(query, function(err, result) {
		  res.json(result);
	  })
	});


	app.get('/sessions/:id', function(req, res){

    // Allow CORS
    var origin = (req.headers.origin || "*");
    res.header("Access-Control-Allow-Origin", origin);

		var query = {
			sessionID: req.params.id
		};

	  db.logs.find(query, function(err, result) {
	  	res.json(result);
	  })
	});

  app.get('/stats/activities', function(req, res) {
    var query = [
    {'$match': {'type': 'USERACTION'}},
    {'$group': {
        '_id':'$parms.activity',
        'nLogs': {'$sum': 1},
        'components': {'$addToSet': '$component.name'},
        'wfStates': {'$addToSet': '$parms.wf_state'}    
        }
    }
    ]

    db.logs.aggregate(query, function(err, result) {
      res.json(result);
    })

  })
}