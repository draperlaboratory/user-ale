var mongoose = require('mongoose');

var db = mongoose.createConnection('localhost', 'dave');

Schema = mongoose.Schema;

var keywordSchema = new Schema({ 
	name: { type: String, unique: true, required: true } 
});
var entitySchema = new Schema({ 
	name: { type: String, unique: true, required: true } 
});
var userSchema = new Schema({ 
	name: { type: String, unique: true, required: true } 
});

var hypothesisSchema = Schema({
  title	: { type: String, default: '' },
  description	: { type: String, default: '' },
  observations	: [
  {
  	obsvId: { type: Schema.Types.ObjectId, ref: 'Observation' },
  	comments: [String],
  	hits: [Number],
  	summary: String
  }  
  ],
  keywords	: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
  entities	: [{ type: Schema.Types.ObjectId, ref: 'Entity' }]
});

var documentSchema = Schema({
  title	: { type: String, default: '' },
  description	: { type: String, default: '' },
  source: { type: String, default: '' },  
  observation: { type: Schema.Types.ObjectId, ref: 'Observation' },
  keywords	: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
  entities	: [{ type: Schema.Types.ObjectId, ref: 'Entity' }]
});

var observationSchema = Schema({
  title	: { type: String, default: '' },
  description	: { type: String, default: '' },
  documents	: [
  {
  	docId: { type: Schema.Types.ObjectId, ref: 'Document' },
  	comments: [String],
  	hits: [Number],
  	summary: String
  }  
  ],
  keywords	: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
  entities	: [{ type: Schema.Types.ObjectId, ref: 'Entity' }]
});

var Keyword = db.model('Keyword', keywordSchema);
var Entity = db.model('Entity', entitySchema);
var User = db.model('User', userSchema);

var Hypothesis = db.model('Hypothesis', hypothesisSchema);
var Observation = db.model('Observation', observationSchema);
var Document = db.model('Document', documentSchema);

// createAll()

exports.Observation = Observation;
exports.Keyword = Keyword;
exports.Entity = Entity;
exports.Document = Document;

function createAll() {
	// drop all collections
	[Keyword, Entity, User, Observation].forEach(function(d) {
		d.remove({}, function(err) { 
			console.log('collection removed') 
		});
	});

	var kws = d3.range(10).map(function(d) {
		a = new Keyword({name: 'keyword_' + d})
		a.save();
		return a;
	})

	var entities = d3.range(10).map(function(d) {
		a = new Entity({name: 'entity_' + d})
		a.save();
		return a;
	})

	var observations = d3.range(10).map(function(d) {
		var a = new Observation({
			title: 'observation_' + d,
			keywords: d3.shuffle(kws).slice(0,3).map(function(d){ return d._id; }),
			entities: d3.shuffle(entities).slice(0,3).map(function(d){ return d._id; })
		});
		a.save();
		return a;
	})	
}