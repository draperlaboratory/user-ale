app.directive('bootstrapNav', function() {
  return {
    restrict: 'AEC',
    templateUrl: 'templates/directives/bootstrap-nav.html',
    scope: { url: '=', name: '='},
    controller: function($scope, $location) { 
      // console.log('here')
      // $scope.loc = $location.path();
      // $scope.$watch('loc', function(data){
      //   console.log('l1', data)
      // });
      $scope.isActive = function () { 
    // console.log('here2', viewLocation, ('/#' + $location.path()))
        return $scope.url === ('/#' + $location.path());
    };
    },
    link: function(scope, el, attr){
      // scope.$watch('loc', function(data){
      //   console.log('l', data)
      // });
      // if (scope.url === ('/#' + scope.loc)) {
      //   el.addClass('active');
      // } else {
      //   el.removeClass('active')
      // }
      // console.log(scope.isActive())
    }      
  }
})

// console.log('here')