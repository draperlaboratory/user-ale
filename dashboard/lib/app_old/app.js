App = Ember.Application.create();

App.ApplicationView = Ember.View.extend({
    didInsertElement: function(event) {
      console.log('Enabling Draper Logger');
      window.ac = new activityLogger().echo(true).testing(true);
    }
});

App.ApplicationController = Ember.ArrayController.extend({
  registered: false,
  testing: true,  
  logUrl: '',
  actions: {
    record: function() {
      this.set('testing', !this.get('testing'));
      ac.testing(this.get('testing'))

      if (!this.get('registered')) {
        this.set('registered', true);
        ac.registerActivityLogger(this.get('logUrl'), "Dashboard", "0.1");
      }

      

      // var url = 'http://dcrlinuxvm.draper.com:1337';
      // window.ac = new activityLogger().echo(true).testing(true);
      // ac.registerActivityLogger(url, "Dashboard", "0.1");
    }
  }
});

App.Router.map(function() {
  this.resource('index', { path: '/' });
  // this.resource('sessions', { path: '/sessions' });
  // this.resource('session', { path: '/session/:session_id' });
  // this.resource('query', { path: '/query' });
  // this.resource('post', { path: '/post' });
  // this.resource('todos', { path: '/todos' });
  // this.resource('dessions', { path: '/dession' });
  // this.resource('dession', { path: '/dession/:dession_id' });
});

App.IndexRoute = Ember.Route.extend({
  afterModel: function(posts, transition) {
    this.transitionTo('sessions');    
  }
});

// App.SessionsController = Ember.ArrayController.extend({
//   queryParams: ['query'],
//   query: null,
  
//   queryField: Ember.computed.oneWay('query'),
//   actions: {
//     search: function() {
//       this.set('query', this.get('queryField'));
//     },
//     link: function(obj) {
//      this.transitionToRoute('session', obj.get('_id'))
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

// App.SessionController = Ember.ArrayController.extend({
//   session: null,
//   stuff: function(d){
//     return "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.get('content')));
//   }.property('content'),
//   minTime: function(d){
//     return d3.min(this.get('content'), function(d) { return d.timestamp; });
//   }.property('content'),
//   maxTime: function(d){
//     return d3.max(this.get('content'), function(d) { return d.timestamp; });
//   }.property('content'),
//   duration: function(d){
//     var min = d3.min(this.get('content'), function(d) { return d.timestamp; }),
//     max = d3.max(this.get('content'), function(d) { return d.timestamp; });
//     return +moment(max).diff(moment(min));
//   }.property('content'),
//   numLogs: function(d){
//     return +this.get('content').length;
//   }.property('content')
// })

// App.Session = Ember.Object.extend({
//   _id: null,
//   numLogs: null,
//   minTime: null,
//   maxTime: null,
//   client: null,
//   numUserActions: null,
//   component: null,
//   duration: function() {    
//     return +moment(this.get('maxTime')).diff(moment(this.get('minTime')));
//   }.property('maxTime','minTime'),
//   numSysActions: function() {    
//     return this.get('numLogs') - this.get('numUserActions');
//   }.property('numUserActions','numLogs')
// });

// App.Log = Ember.Object.extend({
//   _id: null,
//   type: null,
//   component: null,
//   description: null,
//   timestamp: null,
//   isSys: function() {    
//     return this.get('type') == 'SYSACTION';
//   }.property('type'),
// });

// App.SysLog = App.Log.extend();
// App.UserLog = App.Log.extend({
//   wfState: null,
//   action: null
// });

// App.SessionsRoute = Ember.Route.extend({
//   model: function(params) {
//     //var url = 'http://xd-draper.xdata.data-tactics-corp.com:8001/sessions' + $.param(params);
//     var url = '/sessions' + $.param(params);
//     return Ember.$.getJSON(url).then(function(data) {
//       return data.sessions.map(function(d) { return App.Session.create(d); });
//     });
//   }
// });

// App.QueryController = Ember.ArrayController.extend({
//   queryParams: ['query'],
//   query: null,
  
//   queryField: Ember.computed.oneWay('query'),
//   actions: {
//     search: function() {
//       this.set('query', this.get('queryField'));
//     }
//   }
// });

// App.QueryRoute = Ember.Route.extend({
//   model: function(params) {
//     if (!params.query) {
//       return []; // no results;
//     }
    
//     var regex = new RegExp(params.query);
//     return words.filter(function(word) {
//       return regex.exec(word);
//     });
//   },
//   actions: {
//     queryParamsDidChange: function() {
//       // opt into full refresh
//       this.refresh();
//     }
//   }
// })

// App.QueryView = Ember.View.extend({
//     didInsertElement: function(event) {
//       $('#datetimepicker1').datetimepicker();
//       $('#datetimepicker2').datetimepicker();
//     }
// });

// App.SessionRoute = Ember.Route.extend({
//   model: function(params) {

//     this.controllerFor('session').set('session', params.session_id)

//     json = {sessionID: params.session_id};
//     //var url = 'http://xd-draper.xdata.data-tactics-corp.com:8001/test?' + $.param(json);
//     var url = '/test?' + $.param(json);
    
    
//     return Ember.$.getJSON(url).then(function(data) {
//       // console.log(data);
//       var out = data.session.map(function(d){
//         out = {_id:d._id, type:d.type, component:d.component.name, description:d.parms.desc, timestamp:d.timestamp}
//         return d.type=='USERACTION' ? App.UserLog.create($.extend(out, {wfState:d.parms.wf_state, activity:d.parms.activity})) : App.SysLog.create(out);
//       })

//       // console.log(out)
//       return out;
//     });    
//   },
//   actions: {
//     queryParamsDidChange: function() {      
//       this.refresh();
//     }
//   }
// });




// App.Pollster = Ember.Object.extend({
//   start: function(){
//     this.timer = setInterval(this.onPoll.bind(this), 500);
//   },
//   stop: function(){
//     clearInterval(this.timer);
//   },
//   onPoll: function(){
//     // Issue JSON request and add data to the store
//   }
// });

// App.PostRoute = Ember.Route.extend({
//   setupController: function(controller, model) {
//     console.log('setupController');
//     if (Ember.isNone(this.get('pollster'))) {
//       console.log('polling');
//       var route = this;
//       this.set('pollster', App.Pollster.create({
//         last_time: new Date(),
//         onPoll: function() {
//           // console.log('polling');
//           Ember.$.getJSON('/updates', {time: this.get('last_time')}).then(function(json_obj) {

//             // The JSON structure is as follows:
//             // {
//             //   comments: [
//             //     { ... },
//             //     { ... },
//             //   ]
//             // }

//             // Iterate through the comments
//             json_obj.logs.forEach(function(comment) {
//               var result = Ember.Object.create({
//                 isLoaded: false
//               });

//               result.setProperties(comment);
//               result.set('isLoaded', true);
//               // Make sure that the comment is not already in the store
//               if (! route.get('store').recordIsLoaded(result, result._id)) {
//                 console.log(route.get('store'))
//                 route.get('store').push('comment', result);
//               }
//             });

//             if (json_obj.logs.length) console.log(json_obj);
//           });

//           this.set('last_time', new Date())
//         }
//       }));
//     }
//     this.get('pollster').start();
//   },
//   // This is called upon exiting the Route
//   deactivate: function() {
//     this.get('pollster').stop();
//   }
// });

App.WfColors = Ember.Mixin.create({
  colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2'],
  wfStates: [
      'Other',
      'Define Problem',
      'Get Data',
      'Explore Data',
      'Create View',
      'Enrich Data',
      'Transform Data'
      ],
  wfStates2: [
    {id: 0, name: 'Other'},
    {id: 1, name: 'Define Problem'},
    {id: 2, name: 'Get Data'},
    {id: 3, name: 'Explore Data'},
    {id: 4, name: 'Create View'},
    {id: 5, name: 'Enrich Data'},
    {id: 6, name: 'Transform Data'}
  ]
});