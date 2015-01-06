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