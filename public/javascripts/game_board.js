// Animation for Question click
$(document).ready(function(){
  $('.qBox').click(function() {
    var h = $(this).height();
    var w = $(this). width();
    var posn = $(this).offset();
    console.log(posn)
    $("body").append("<div id='Question' "
        + "style='background-color: #0000A0; position: fixed; z-index: 1;"
        + "top: " + (posn['top'].toString() + "px")
        + "; left: " + (posn['top'].toString() + "px") + "; "
        + "height: " + h + "; width: " + w +"; "
        + "border: 1px solid white'"
        + "></div>");
    var offset = $('#Question').offset();
    console.log(offset)
    $("#Question").animate({height: "100vh",
        width: "200vh",
        "top": ("-=" + offset['top'].toString() + "px"),
        "left": ("-=" + offset['left'].toString() + "px")},
        "slow", function() {
          $(this).bind("click", function(){
            $(this).remove();
          })
        });
  });
});


console.log('Module loaded')
angular.module('GameBoard', [])

.controller('Header', ['$scope', function($scope) {
  $scope.score = 1000;
}])


.controller('gameCol', ['$scope', function($scope) {
  $scope.a = 1;
  $scope.b = 2;
}])
