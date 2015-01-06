Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).format('DDMMMYY');
});

Ember.Handlebars.helper('format-date-time', function(date) {
  return moment(date).format('DDMMMYY h:mm:ss a');
});

Ember.Handlebars.helper('format-time', function(date) {
  return moment(date).format('h:mm:ss.SSS a');
});

Ember.Handlebars.helper('format-time-simple', function(date) {
  return moment(date).format('h:mm:ss a');
});

Ember.Handlebars.helper('format-date-full', function(date) {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});

Ember.Handlebars.helper('format-duration-human', function(duration) {
  return moment.duration(duration).humanize();
});

Ember.Handlebars.helper('format-id', function(id) {
  if (id) {
    return id.slice(0, 4) + id.slice(id.length-3, id.length);
  }  
});

Ember.Handlebars.helper('format-action', function(action) {
  if (action == 'USERACTION') {
    return 'UA';
  } else if (action == 'FEEDBACK') {
    return 'FB';
  }  else if (action == 'SYSACTION') {
    return 'SA';
  }  
});


Ember.Handlebars.helper('format-duration', function(duration) {
  return moment.utc(duration).format("HH:mm:ss");
});