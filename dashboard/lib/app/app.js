var app = angular.module('xdata-db', [
  'ngRoute',
  'ngResource',
  'ui.bootstrap',
  'ngAnimate'
  ]);

$.ajaxSetup({
  beforeSend:function(){
      $('.draper').toggleClass('active')
  },
  complete:function(){
      $('.draper').toggleClass('active')
  }
})

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
      templateUrl: 'templates/index.html',
      controller: 'IndexController'
    })
    .when('/session/:id', {
      templateUrl: 'templates/session.html',
      controller: 'SessionController'
    })
    .when('/stats/compActivity', {
      templateUrl: 'templates/stats-comp-activity.html',
      controller: 'StatsController'
    })
		.otherwise({ redirectTo: '/' });
}]);

// app.run(function($rootScope) { // instance-injector
//   scope.$watch(function() {
//     return $http.pendingRequests.length > 0;
//   }, function (v) {
//     if(v){
//         elm.show();
//     }else{
//         elm.hide();
//     }
//   });
// });

app.factory('Session', function($resource) {
  // return $resource('http://10.1.90.46:1337/sessions/:id', {}, {
  return $resource('/sessions/:id', {}, {
    // Use this method for getting a list of observations
    query: {
      method: 'GET',
      params: {},
      isArray: true,
    }
  })
});

app.factory('Document', function($resource) {
  return $resource('/rf_docs', {}, {
    // Use this method for getting a list of polls
    query: {
      method: 'GET',
      params: {},
      isArray: true,
    },
  })
})

app.controller('AppController', ['$scope', '$location', function($scope, $location) {
  $scope.title = 'XDATA Logging Dashboard';
  $scope.routes = [
    {url: '/#/', name: 'Home'}
  ]
}]);

app.controller('IndexController', [
  '$scope',
  'Session',
  '$filter',
  '$location',
  '$window',
  function($scope, Session, $filter, $location, $window) {

  $scope.numberOfPages = 0;
  $scope.pageSize = 20;

  $scope.sesFilter = {
    curComponent: null,
    curUser: null,
    dt: null,
    orderBy: {
      label: 'start',
      state: true
    }
  };

  angular.element($window).on('resize', $scope.$apply.bind($scope));

  $scope.sessions = Session.query();
  $scope.filtSessions = [];

  $scope.sessions
  .$promise.then(function(d) {
    console.log(d);
    $scope.components = groupBy(d, 'component').map(function(d) { return d.key; });
    $scope.users = groupBy(d, 'user').map(function(d) { return d.key; });

    $scope.components2 = groupBy(d, 'component')
    $scope.users2 = groupBy(d, 'user')

    var tmp = $filter('sessionFilters')($scope.sessions, $scope.sesFilter);
    $scope.filtSessions = $filter('orderBy')(tmp, 'start', true);
    $scope.numberOfPages = Math.ceil(d.length/$scope.pageSize);
    $scope.currentPage = 0;
    $scope.pagedData = $filter('pageFilter')(d, $scope.currentPage, $scope.pageSize);
  });

  $scope.nSysLogs = function(d) {
    // console.log(d);
    return d.nLogs - d.nUserLogs;
  }

  // $scope.orderBy = function(field) {
  //   if ($scope.sesFilter.orderBy[0] === field) {
  //     $scope.sesFilter.orderBy[1] = !$scope.sesFilter.orderBy[1];
  //   } else {
  //     $scope.sesFilter.orderBy = [field, true]
  //   }
  // }

  $scope.duration = function(d) {
    // console.log(d);
    var start = new Date(d.start);
    var stop = new Date(d.stop);
    return stop.getTime() - start.getTime();
  }

  $scope.$watch('sesFilter', function(sesFilter) {
    console.log('filter Changed')
    var tmp = $filter('sessionFilters')($scope.sessions, $scope.sesFilter);
    $scope.filtSessions = $filter('orderBy')(tmp, sesFilter.orderBy.label, sesFilter.orderBy.state)
    // $scope.pagedData = $filter('pageFilter')($scope.filtSessions, 0, $scope.pageSize);
  }, true);

  $scope.$watch('filtSessions', function(d) {
    $scope.numberOfPages = Math.ceil(d.length/$scope.pageSize);
    $scope.pagedData = $filter('pageFilter')(d, $scope.currentPage = 0, $scope.pageSize);
  })

  function groupBy(data, field) {
    var t = d3.nest()
    .key(function(d) { return d[field]; })
    .entries(data);

    return t;
  }

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.initDate = new Date('2016-15-20');

  $scope.redirect = function(d) {
    $location.path("/session/" + d._id)
  }

  $scope.$watch('currentPage', function(d) {
    $scope.pagedData = $filter('pageFilter')($scope.filtSessions, $scope.currentPage, $scope.pageSize);
    if ($scope.currentPage > $scope.numberOfPages) {
      $scope.currentPage = $scope.numberOfPages-1;
    }
  });
}]);

app.filter('sessionFilters', function() {
  return function( items, sesFilter) {
    var filtered = [];
    angular.forEach(items, function(item, i) {
      var component = !sesFilter.curComponent || (item.component ===  sesFilter.curComponent);
      var user = !sesFilter.curUser || (item.user ===  sesFilter.curUser);
      var dt = !sesFilter.dt || (d3.time.day(new Date(item.start)).getTime() ==  new Date(sesFilter.dt).getTime());

      if(component && user && dt) {
        filtered.push(item);
      }
    });
    return filtered;
  };
});

app.directive('draperLogo', ['$http', 
  function ($http) {
  return {
    restrict: 'E',
    templateUrl: 'templates/directives/draper-logo.html',
    link: function (scope, elm, attrs) {
      scope.isLoading = function () {
        return $http.pendingRequests.length > 0;
      };
      scope.$watch(scope.isLoading, function (v)
      { 
        if (v) {
          $('.draper').toggleClass('active')
        } else {
          $('.draper').toggleClass('active')
        }
        
      });
    }
  };
}]);