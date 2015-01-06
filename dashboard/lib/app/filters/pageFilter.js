app.filter('pageFilter', function(){
  return function(input, currentPage, pageSize){
    return input.filter(function(d,i) {
      return (i >= currentPage*pageSize) && (i < (currentPage+1)*pageSize)
    });
  };
});

var a = [{name: 'a', num:2}, {name: 'b', num:3}]
app.filter('pageFilter2', function() {
  return function( items, userAccessLevel) {
  	console.log(items);
    var filtered = [];
    angular.forEach(items, function(item, i) {
      if(item.name ===  'Yogyakarta') {
        filtered.push(item);
      }
    });
    return filtered;
  };
});

app.filter('moment', function() {
  return function( items, userAccessLevel) {
    console.log(items);
    var filtered = [];
    angular.forEach(items, function(item, i) {
      if(item.name ===  'Yogyakarta') {
        filtered.push(item);
      }
    });
    return filtered;
  };
});

app.filter('duration', function() {
  return function( duration, userAccessLevel) {
    
    return moment.duration(duration, 'milliseconds').humanize();
  };
});