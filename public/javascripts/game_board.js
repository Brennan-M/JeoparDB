console.log('Module loaded')
angular.module('GameBoard', [])

.controller('gameCol', ['$scope', function($scope) {
  $scope.a = 1;
  $scope.b = 2;
}])
