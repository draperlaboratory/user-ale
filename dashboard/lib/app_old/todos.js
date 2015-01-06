



// // App.Dession = DS.Model.extend({
// //   logs: DS.hasMany('log', {embedded: true}),
// //   extra: DS.attr()
// // })

// // App.Log = DS.Model.extend({
// //   // sessionID: DS.attr('string'),
// //   timestamp: DS.attr('date'),
// //   parms: DS.attr(),
// //   // dave: DS.attr('string'),
// //   // isCompleted: DS.attr('boolean'),
// //   editable: false,
// //   dession: DS.belongsTo('dession')
// // })

// // console.log('hey')
// // App.LogAdapter = DS.RESTAdapter.extend({
// //   primaryKey: '_id'
// // });

// // App.LogSerializer = DS.RESTSerializer.extend({
// //   primaryKey: '_id',
// //   // normalizeHash: {
// //   //   type: function(hash) {
// //   //     console.log(hash);
// //   //     hash.dave = hash.type;
// //   //     delete hash.type;
// //   //     return hash;
// //   //   }
// //   // }
// // });
// App.Dession = Ember.Object.extend({
//   // start?l,
// });

// App.Log = Ember.Object.extend({
//   // start?l,
// });

// App.Dession.reopenClass({
//   find: function(postId) {
//     // Set some default properties here.
//     var result = Ember.Object.create({
//       isLoaded: false
//     });

//     $.getJSON('/dessions/1', function(data) {
//       console.log(data)
//       data.logs.forEach(function(d){ d.timestamp = new Date(d.timestamp); })
//       result.setProperties(data);
//       result.set('isLoaded', true);

//       // App.LogsController.set('content', data.logs);
//     });

//     return result;
//   }
// });


// // App.TodosRoute = Ember.Route.extend({
// //   // model: function() {
// //   //   console.log(this.store.find('todo'))
// //   //   return this.store.find('todo');
// //   // }
// //   model: function() {
// //     console.log(this.store.find('todoList'))
// //     return this.store.find('todoList');
// //   }
// // });



// App.DessionRoute = Ember.Route.extend({
//   // model: function() {
//   //   console.log(this.store.find('todo'))
//   //   return this.store.find('todo');
//   // }
//   // setupController: function(controller, model) {
//   //   console.log(model, this.controllerFor('logs'));
//   //   controller.set('model', model);
//   //   this.controllerFor('logs').set('model', model.logs);
//   // },
//   model: function() {
//     // console.log(this.store.find('dession', 1))
//     // return this.store.find('dession', 1);
//     return App.Dession.find();
//   }
// });

// // App.TodosRoute = Ember.Route.extend({
// //   // model: function() {
// //   //   console.log(this.store.find('todo'))
// //   //   return this.store.find('todo');
// //   // }
// //   model: function() {
// //     // console.log(this.store.find('todo'))
// //     return this.store.find('todoList');
// //   }
// // });

// App.LogsController = Ember.ArrayController.extend({
//  sortProperties: ['timestamp'],
//  itemController: 'log',
//   actions: {
//     // createTodo: function() {
//     //   console.log('createTodo');

//     //   var dateObj = this.get('timestamp');
//     //   console.log(dateObj);
//     //   dateObj += 1;

//     //   var timestamp = new Date(dateObj);      

//     //   // Create the new Todo model
//     //   var todo = this.store.createRecord('todo', {
//     //     timestamp: timestamp
//     //   });

//     //   // // Clear the "New Todo" text field
//     //   // this.set('newTitle', '');

//     //   // Save the new model
//     //   // todo.save();
//     // }
//   }
// });

// App.LogController = Ember.ObjectController.extend({
//  // sortProperties: ['timestamp'],
//  needs: ['dession'],
//  wfStates: [0,1,2,3,4,5,6],
//   actions: {
//     createTodo: function() {
//       console.log('createTodo');

//       var dateObj = this.get('timestamp');
//       // console.log(dateObj);
//       // dateObj += 1;

//       var timestamp = new Date(dateObj.getTime() + 1); 

//       console.log('New Log', dateObj, timestamp, this)     

//       var log = Ember.Object.create({
//         timestamp: timestamp,
//         editable: true,
//         isLoaded: true
//       });

//       this.get('controllers.dession.logs').addObject(log);

//       console.log(this.get('controllers.dession.logs').length)

//     // $.getJSON('/dessions/1', function(data) {
//     //   console.log(data)
//     //   data.logs.forEach(function(d){ d.timestamp = new Date(d.timestamp); })
//     //   result.setProperties(data);
//     //   result.set('isLoaded', true);
//     // });

//       // Create the new Todo model
//       // var todo = this.store.createRecord('log', {
//       //   timestamp: timestamp,
//       //   editable: true,
//       //   dession: this.get('controllers.dession')
//       // });

//       // // Clear the "New Todo" text field
//       // this.set('newTitle', '');

//       // Save the new model
//       // todo.save();
//     },
//     removeLog: function() {
//     var log = this.get('model');
//     log.deleteRecord();
//     // todo.save();
//   },
//   }
// });










// // App.TodoAdapter = DS.FixtureAdapter.extend();

// // App.Todo.FIXTURES = [
// //  {
// //    id: 1,
// //    title: 'Learn Ember.js',
// //    isCompleted: true
// //  },
// //  {
// //    id: 2,
// //    title: '...',
// //    isCompleted: false
// //  },
// //  {
// //    id: 3,
// //    title: 'Profit!',
// //    isCompleted: false
// //  }
// // ];