app.controller('SessionController', [
  '$scope',
  'Session',
  '$filter',
  '$routeParams',
  '$window',
  '$modal',
  'wfStates',
  function($scope, Session, $filter, $routeParams, $window, $modal, wfStates) {
  $scope.filtData = [];
  $scope.numberOfPages = 0;
  $scope.pageSize = 20;

  $scope.orderBy = {
    label: 'timestamp',
    state: false
  };

  angular.element($window).on('resize', $scope.$apply.bind($scope));
  $scope.logs = Session.query({id:$routeParams.id});

  $scope.filtData = $scope.logs;

  $scope.activities = [];


  $scope.logs
  .$promise.then(function(d) {

    d.forEach(function(d) { d.timestamp = new Date(d.timestamp); })
      
    d.sort(function(a,b){return a.timestamp.getTime() - b.timestamp.getTime()});

    $scope.activities = d3.nest()
    .key(function(d) { 
      return d.parms.activity; 
    })
    .entries(d.filter(function(d) {
      return d.type == 'USERACTION';
    }))

    console.log('AAAA', $scope.activities);

    $scope.component = d[0].component;
    d.forEach(function(d, i) {
      d.index = i;
      // d.timestamp = new Date(d.timestamp);

      if (d.type === 'SYSACTION') {
        d.color = "#eee";
      } else {
        try {
          var tmp =  _.findWhere(wfStates.wfStates, {id: +d.parms.wf_state});
          d.color = tmp.color;
          d.parms.name = tmp.name;
        }
        catch(err) {
          var tmp =  _.findWhere(wfStates.wfStates, {id: 99});
          d.color = tmp.color;
          d.parms.name = tmp.name;
        }        
      }
    })    

    $scope.numberOfPages = Math.ceil(d.length/$scope.pageSize);
    $scope.currentPage = 0;
    var tmp = $filter('orderBy')(d, 'timestamp', false)

    $scope.filtData = tmp;
    // $scope.pagedData = $filter('pageFilter')(tmp, $scope.currentPage, $scope.pageSize);
  });

  $scope.duration = function(d) {
    if (!$scope.logs.length) { return; }
    // console.log(d);
    var extent = d3.extent($scope.logs, function(d) {
      return new Date(d.timestamp);
    })
    return extent[1].getTime() - extent[0].getTime();
  }

  $scope.activityModal = function() {
    console.log('activityModal')

    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/activity.html',
      controller: ActivityModalCtrl,
      size: 'lg',
      resolve: {
        activities: function () {
          return $scope.activities;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });
  }


  $scope.timebounds = null;

  $scope.$watch('timebounds', function(d) {
    $scope.filtData = $filter('timeFilters')($scope.logs, d);
    $scope.filtData = $filter('orderBy')($scope.filtData, $scope.orderBy.label, $scope.orderBy.state);
  })

  // watch for any changes in filtData
  $scope.$watch('filtData', function(d) {
    console.log('A', d.length)
    $scope.numberOfPages = Math.ceil(d.length/$scope.pageSize);
    $scope.pagedData = $filter('pageFilter')(d, $scope.currentPage = 0, $scope.pageSize);
  })

  $scope.$watch('orderBy', function(orderBy) {
    console.log('ORDER2', orderBy, $scope.filtData)
    $scope.filtData = $filter('orderBy')($scope.filtData, orderBy.label, orderBy.state);
  }, true);


  $scope.$watch('currentPage', function(d) {
    var tmp = $filter('orderBy')($scope.filtData, 'timestamp', false)
    $scope.pagedData = $filter('pageFilter')(tmp, $scope.currentPage, $scope.pageSize);
    if ($scope.currentPage > $scope.numberOfPages) {
      $scope.currentPage = $scope.numberOfPages-1;
    }
  });

  $scope.getBlob = function(){
    console.log($scope.logs);
    var json = JSON.stringify($scope.logs);
    return new Blob([json], {type: "application/json"});
  }

//   var content = 'file content';
// var blob = new Blob([ content ], { type : 'text/plain' });
// $scope.url = (window.URL || window.webkitURL).createObjectURL( blob );

  $scope.downloadData = function(d){
    var tmp = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($scope.logs));
    return "data:" + tmp;
  };
}]);

app.filter('timeFilters', function() {
  return function( items, timebounds) {
    console.log('timeFilters', timebounds)
    if (!timebounds) return items;

    var filtered = [];
    angular.forEach(items, function(item, i) {
      var a = item.timestamp.getTime() >= (timebounds[0].getTime()-100);
      var b = item.timestamp.getTime() <= (timebounds[1].getTime()+100);

      if(a && b) {
        filtered.push(item);
      }
    });
    return filtered;
  };
});

var ActivityModalCtrl = function ($scope, $modalInstance, activities) {

  $scope.activities = activities;

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};