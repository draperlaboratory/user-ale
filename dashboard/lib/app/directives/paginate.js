app.directive('paginate', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/directives/paginate.html',
    scope: { currentPage: '=', numberOfPages: '='},
    controller: function($scope) {

      function setPage(currentPage, numberOfPages) {
        $scope.pages = [];
        if (numberOfPages < 8) {
          for (var i = 0;i< numberOfPages;i++){
            $scope.pages.push({text:i, cls:i == currentPage ? 'active' : null})
          }
        } else if (currentPage > 3 && currentPage < (numberOfPages - 4)) {
          // console.log('A')
          $scope.pages = $scope.pages.concat([{text:'0', cls:null},{text:'...', cls:'disabled'}]);
          for (var i = currentPage -2;i<= currentPage+2;i++){
            $scope.pages.push({text:i, cls:i == currentPage ? 'active' : null})
          }
          $scope.pages = $scope.pages.concat([{text:'...', cls:'disabled'},{text:numberOfPages ? numberOfPages-1 : '...', cls:null}]);
        } else
        if (currentPage < 4) {
          // console.log('B')
          for (var i = 0;i< 6;i++){
            $scope.pages.push({text: i, cls: i == currentPage ? 'active' : null})
          }
          $scope.pages = $scope.pages.concat([{text:'...', cls:'disabled'},{text:numberOfPages ? numberOfPages-1 : '...', cls:null}]);
        } else
        if (currentPage >= numberOfPages - 4) {
          // console.log('C')
          $scope.pages = $scope.pages.concat([{text:'0', cls:null},{text:'...', cls:'disabled'}]);
          for (var i = numberOfPages - 6;i < numberOfPages;i++){
            $scope.pages.push({text: i, cls: i == currentPage ? 'active' : null})
          }
        }
      }
      $scope.$watch('numberOfPages', function(currentPage){
        setPage($scope.currentPage, $scope.numberOfPages);
      })
      $scope.$watch('currentPage', function(currentPage){
        setPage($scope.currentPage, $scope.numberOfPages);
      });

    }
  }
})