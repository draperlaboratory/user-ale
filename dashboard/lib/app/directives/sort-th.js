app.directive('sortHeader', function () {
  return {
    restrict:'A',
    templateUrl: 'templates/directives/sort-th.html',
        transclude: true,
        scope: {
          order: '=',
          label: '='
        },
        controller: function($scope) {
          console.log('ORDER', $scope.order, $scope.label);          

          // up or down?
          $scope.asc = true;

          // show or hide?
          $scope.on = true;

          $scope.toggleOrder = function() {
            $scope.order.label = $scope.label;
            $scope.order.state = !$scope.order.state
          }

          $scope.$watch(function() {
            return $scope.order;
          }, function(d) {
            if (d.label == $scope.label) {
              $scope.asc = $scope.order.state;
              $scope.on = true;
            } else {
              $scope.on = false
            }
          }, true)
        }
      };
    });