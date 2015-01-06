// App.Dession = DS.Model.extend({
//   logs: DS.hasMany('log', {async: true}),
//   extra: DS.attr()
// });

// App.Log = DS.Model.extend({  
//   timestamp: DS.attr('date'),
//   // parms: DS.attr(),
//   activity: DS.attr(),
//   activityType: DS.attr('string'),
//   wfState: DS.attr('number'),
//   feedback: DS.attr('boolean', {defaultValue: false}),
//   dession: DS.belongsTo('dession', { inverse: 'logs' })
// });

// App.DessionRoute = Ember.Route.extend({  
//   model: function() {    
//     return this.store.find('dession', 1);
//   }
// });

// App.DessionsRoute = Ember.Route.extend({  
//   model: function() {    
//     return this.store.find('dession');
//   }
// });


// App.DessionsController = Ember.ArrayController.extend({
//   queryParams: ['query'],
//   query: null,
  
//   queryField: Ember.computed.oneWay('query'),
//   actions: {
//     search: function() {
//       this.set('query', this.get('queryField'));
//     },
//     link: function(obj) {
//       console.log(obj.get('id'))
//      this.transitionToRoute('dession', obj.get('id'))
//     },  
//     sort: function(sortBy) {
//       var previousSortBy = this.get('sortProperties.0');

//       if (sortBy === previousSortBy) {
//         return this.set('sortAscending', !this.get('sortAscending'));
//       }
//       else {
//         this.set('sortAscending', true);
//         return this.set('sortProperties', [sortBy]);
//       }
//     }
//   },
//   count: function() {
//     return this.get('length');
//   }.property('@each'),  
//   sortProperties: ['maxTime'],
//   sortAscending: false
// });

// App.LogsController = Ember.ArrayController.extend(App.WfColors, {
//   needs: 'dession',
//   dession: Ember.computed.alias("controllers.dession"),
//   itemController: 'log',
//   sortProperties: ['timestamp'],
//   counts: function(){
//     var states = this.get('wfStates'),
//     logs = this.get('content');   
//     console.log(this.get('content.length'))
//     states = states.map(function(d, i) {      
//       return {
//         numLogs: logs.filter(function(d) {          
//           return +d.get('wfState') == i;
//         }).length,
//         text: d,
//         code: i,
//       };
//     });

//     // console.log('COUNTS', states, logs.length, this.get('content.length'));
//     return states;
//   }.property('@each.wfState'),
//   addIndex: function() {
//     this.get('content').forEach(function(d, i) {
//       d.set('myIndex', i);
//     })
//   }.observes('@each'),
//   userLogs: function() {    
//     logs = this.get('content').map(function(d) {
//       // console.log(d);
//       return {
//         timestamp: d.get('timestamp'),
//         wfState: d.get('wfState'),
//         activity: d.get('activity'),
//         type: d.get('activityType')
//       }
//     });

//     logs = logs.sort(function(a,b) {
//       return a.timestamp - b.timestamp;
//     });    

//     logs = logs.filter(function(d) { return d.type != 'SYSACTION'; });    
    
//     return logs;
//   }.property('@each.wfState'),
//   wfData: function() {
//     var wfData = [],
//     curState = {};
    
//     var logs = this.get('userLogs');

//     if (!logs.length) return wfData;

//     logs.forEach(function(d) {
//       // console.log('loopa', d.timestamp, d.wfState)
//       if (d.wfState != curState.state) {
        
//         curState.stop = d.timestamp;
//         if (curState.start) wfData.push(curState);
//         curState = {};
//         curState.state = d.wfState;
//         curState.start = d.timestamp;
//         // console.log('CURSTATE', curState);
//       }
//     });      

//     // console.log('DAVE_WFDATA', wfData, logs);
//     curState.stop = d3.time.second.offset(logs[logs.length-1].timestamp, 5);
//     wfData.push(curState);
    
//     return wfData;
//   }.property('@each.wfState'),
//   actions: {
//     createLog: function(log) {
//       console.log('createLog', log);

//       var timestamp = new Date(log.get('timestamp').getTime() + 1); 
//       var newLog = this.get('dession').store.createRecord('log', {
//         activityType: 'FEEDBACK',
//         timestamp: timestamp,
//         feedback: true
//       });

//       newLog.save();

//       this.get('dession.logs').pushObject(newLog);      
//     }
//   }
// })

// App.LogController = Ember.ObjectController.extend(App.WfColors, {
//   // wfStates: [0,1,2,3,4,5,6],
//   editing: false,
//   // newTimestampBinding: Ember.Binding.oneWay('timestamp'),  
//   newTimestamp: function() {    
//     return moment(this.get('timestamp')).format('h:mm:ss.SSS a');
//   }.property('timestamp'),
//   isEditing: function() {
//     if (this.get('editing') && this.get('feedback')) {
//       return true;
//     } else {
//       return false;
//     }
//   }.property('editing'),
//   wfColor: function() {
//     var id = this.get('wfState');
//     return "background-color:" + this.get('colors')[id];
//   }.property('wfState'),
//   wfStateFormat: function() {
//     var id = this.get('wfState');
//     return this.get('wfStates')[id];
//   }.property('wfState'),
//   actions: {
//     removeLog: function() {
//       var log = this.get('model');
//       log.eachRelationship(function(name, relationship){
//         if (relationship.kind === "belongsTo") {
//           var inverse = relationship.parentType.inverseFor(name);
//           var parent  = log.get(name);
//           if (inverse && parent) parent.get(inverse.name).removeObject(log);
//         }
//       });
//       log.deleteRecord();
//       log.save();
//     },
//     updateLog: function() {
//       var b = moment(this.get('newTimestamp'), 'h:mm:ss.SSS a');
//       var c = moment(this.get('timestamp'));

//       b.year(c.year());
//       b.month(c.month());
//       b.date(c.date());
//       console.log('updateLog', b.toDate());
//       var model = this.get('model');
//       model.set('timestamp', b.toDate());
//       model.set('activity', this.get('activity'));
//       model.set('wfState', this.get('wfState'));
//       model.save();
//       // this.set('editing', false);
//     },
//     editLog: function() {
//       console.log('editing', this.get('editing'))
//       this.set('editing', !this.get('editing'));
//       if (!this.get('editing')) {
//         this.send('updateLog');
//       }      
//     } 
//   }
// });

// App.DessionAdapter = DS.RESTAdapter.extend({
// });

// App.LogAdapter = DS.RESTAdapter.extend({
//   // primaryKey: '_id'
// });

// App.LogSerializer = DS.RESTSerializer.extend({
//   primaryKey: '_id'
// });

// App.DessionSerializer = DS.RESTSerializer.extend({
//   primaryKey: '_id'
// });

// App.DessionAdapter = DS.FixtureAdapter.extend();
// App.LogAdapter = DS.FixtureAdapter.extend();

// App.Dession.FIXTURES = [
// {
//   id: 1,
//   extra: 'dave',
//   logs: [1, 2, 3]
// }
// ]

// var dateObj = new Date();

// App.Log.FIXTURES = [
//   {
//     id: 1,    
//     timestamp: new Date(dateObj.getTime() + 1000),
//     parms: 'parms1',
//     dession: 1
//   },
//   {
//     id: 2,
//     timestamp: new Date(dateObj.getTime() + 7000),
//     parms: 'parms2',
//     dession: 1
//   },
//   {
//     id: 3,
//     timestamp:  new Date(dateObj.getTime() + 3000),
//     parms: 'parms3',
//     dession: 1
//   }
// ];