console.log('Module loaded')
angular.module('GameBoard', [])

.controller('Header', ['$scope', function($scope) {
  $scope.score = 1000;
}])


.controller('gameCol', ['$scope', function($scope) {
  $scope.a = 1;
  $scope.b = 2;
}])
