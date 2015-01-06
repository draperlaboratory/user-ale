App.Router.map(function() {
  this.resource("sessions", { path: "/session" });
  this.resource("session", { path: "/session/:session_id" });
});

App.SessionAdapter = DS.RESTAdapter.extend();
App.LogAdapter = DS.RESTAdapter.extend();
App.SessionSerializer = DS.RESTSerializer.extend({
  primaryKey: '_id'
});
App.LogSerializer = DS.RESTSerializer.extend({
  primaryKey: '_id'
});

App.Session = DS.Model.extend({
	// name: DS.attr('string'),
 //  nMembers: DS.attr('number'),
 //  firstShow: DS.attr('date'),
 	user: DS.attr('string'),
 	component: DS.attr('string'),
 	start: DS.attr('date'),
  logs: DS.hasMany('log', {async: true})
});

App.Log = DS.Model.extend({
	timestamp: DS.attr('date'),
  activity: DS.attr(),
  activityType: DS.attr('string'),
  activityDesc: DS.attr('string'),
  wfState: DS.attr('number'),
  feedback: DS.attr('boolean', {defaultValue: false}),
  sessionID: DS.belongsTo('session', { inverse: 'logs' })

  // releaseDate: DS.attr('date'),
  // title: DS.attr('string'),
  // nTracks: DS.attr('number'),
  // session: DS.belongsTo('Session', { inverse: 'logs' })
});

App.SessionsController = Ember.ArrayController.extend({
	itemController: 'session',
	sortProperties: ['start'],
	sortAscending: false, // false for descending
	actions: {    
    link: function(obj) {
     this.transitionToRoute('session', obj)
    }
  },
});

App.SessionController = Ember.ObjectController.extend({
	minTime: function(){		
		return d3.min(this.get('logs').toArray(), function(d) { return d.get('timestamp'); });
	}.property('logs.@each'),
	maxTime: function(){		
		return d3.max(this.get('logs').toArray(), function(d) { return d.get('timestamp'); });
	}.property('logs.@each'),	
	duration: function(){		
		var max = d3.max(this.get('logs').toArray(), function(d) { return d.get('timestamp'); });
		var min = d3.min(this.get('logs').toArray(), function(d) { return d.get('timestamp'); });
		if (min && max) return max.getTime() - min.getTime();
	}.property('logs.@each'),
	nUserLogs: function() {
		return this.get('logs').toArray().filter(function(d) { return d.get('activityType') == 'USERACTION'}).length;
	}.property('logs.@each'),
	nSysLogs: function() {
		return this.get('logs').toArray().filter(function(d) { return d.get('activityType') == 'SYSACTION'}).length;
	}.property('logs.@each'),
	downloadData: function(d){
		console.log(this.get('logs').toArray())
		var tmp = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.get('logs').toArray()));		
		return "data:" + tmp;
    
  }.property('logs.@each'),
});

App.LogsController = Ember.ArrayController.extend(App.WfColors, {
	itemController: 'log',
	sortProperties: ['timestamp'],
	needs: 'session',
  session: Ember.computed.alias("controllers.session"),
  counts: function(){
    var states = this.get('wfStates'),
    logs = this.get('content');   
    console.log(this.get('content.length'))
    states = states.map(function(d, i) {      
      return {
        numLogs: logs.filter(function(d) {          
          return +d.get('wfState') == i;
        }).length,
        text: d,
        code: i,
      };
    });

    // console.log('COUNTS', states, logs.length, this.get('content.length'));
    return states;
  }.property('@each.wfState'),
  // addIndex: function() {
  //   this.get('content').forEach(function(d, i) {
  //     d.set('myIndex', i);
  //   })
  // }.observes('@each'),
  userLogs: function() {    
    logs = this.get('content').map(function(d) {
      // console.log(d);
      return {
        timestamp: d.get('timestamp'),
        wfState: d.get('wfState'),
        activity: d.get('activity'),
        type: d.get('activityType')
      }
    });

    logs = logs.sort(function(a,b) {
      return a.timestamp - b.timestamp;
    });    

    logs = logs.filter(function(d) { return d.type != 'SYSACTION'; });    
    
    return logs;
  }.property('@each.wfState'),
  wfData: function() {
    var wfData = [],
    curState = {};
    
    var logs = this.get('userLogs');

    if (!logs.length) return wfData;

    logs.forEach(function(d) {
      // console.log('loopa', d.timestamp, d.wfState)
      if (d.wfState != curState.state) {
        
        curState.stop = d.timestamp;
        if (curState.start) wfData.push(curState);
        curState = {};
        curState.state = d.wfState;
        curState.start = d.timestamp;
        // console.log('CURSTATE', curState);
      }
    });      

    // console.log('DAVE_WFDATA', wfData, logs);
    curState.stop = d3.time.second.offset(logs[logs.length-1].timestamp, 5);
    wfData.push(curState);
    
    return wfData;
  }.property('@each.wfState'),
	actions: {
    createLog: function(log) {
      console.log('createLog', log);

      var timestamp = new Date(log.get('timestamp').getTime() + 1); 
      var newLog = this.get('session').store.createRecord('log', {
        timestamp: timestamp,
        activityType: 'FEEDBACK',
        wfState: log.get('wfState'),
        feedback: true
      });

      newLog.save();

      this.get('session.logs').pushObject(newLog);      
    }
  }
});

App.LogController = Ember.ObjectController.extend(App.WfColors, {
	editing: false,
	newTimestamp: function() {    
    return moment(this.get('timestamp')).format('h:mm:ss.SSS a');
  }.property('timestamp'),
	wfColor: function() {
    var id = this.get('wfState');
    return "background-color:" + this.get('colors')[id];
  }.property('wfState'),
  wfStateFormat: function() {
    var id = this.get('wfState');
    return this.get('wfStates')[id];
  }.property('wfState'),
  isEditing: function() {
    if (this.get('editing') && this.get('feedback')) {
      return true;
    } else {
      return false;
    }
  }.property('editing'),
  actions: {
    removeLog: function() {
      var log = this.get('model');
      log.eachRelationship(function(name, relationship){
        if (relationship.kind === "belongsTo") {
          var inverse = relationship.parentType.inverseFor(name);
          var parent  = log.get(name);
          if (inverse && parent) parent.get(inverse.name).removeObject(log);
        }
      });
      log.deleteRecord();
      log.save();
    },
    updateLog: function() {
      var b = moment(this.get('newTimestamp'), 'h:mm:ss.SSS a');
      var c = moment(this.get('timestamp'));

      b.year(c.year());
      b.month(c.month());
      b.date(c.date());
      console.log('updateLog', b.toDate());
      var model = this.get('model');
      model.set('timestamp', b.toDate());
      model.set('activity', this.get('activity'));
      model.set('wfState', this.get('wfState'));
      model.save();
      this.set('editing', false);
    },
    editLog: function() {
      console.log('editing', this.get('editing'))
      this.set('editing', !this.get('editing'));
      if (!this.get('editing')) {
        this.send('updateLog');
      }      
    } 
  }
})

App.SessionsRoute = Ember.Route.extend({  
  model: function() {    
    return this.store.find('session');
  }
});