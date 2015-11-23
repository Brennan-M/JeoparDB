// Global vars
var selectedCluster = [undefined, undefined, undefined, undefined, undefined];
// Handlers
$(document).ready(function() {
  // Question click
  $('.qBox').click(function() {
    $(this).empty();
    $(this).off("click");
    $(this).removeClass("qBox");
    $(this).addClass("clickedQBox")
    var h = $(this).height();
    var w = $(this). width();
    var posn = $(this).offset();
    console.log(posn)
    $("body").append("<div class='Question' "
        + "style='background-color: #0000A0; position: fixed; z-index: 1;"
        + "top: " + ((posn['top'] + h/2).toString() + "px")
        + "; left: " + ((posn['left'] + w/2).toString() + "px") + "; "
        + "height: " + h + "; width: " + w +"; "
        + "border: 1px solid white'"
        + "></div>");
    var offset = $('.Question').offset();
    console.log(offset)
    $(".Question").animate({height: "100%",
        width: "100%",
        "top": ("-=" + offset['top'].toString() + "px"),
        "left": ("-=" + offset['left'].toString() + "px")},
        "slow", function() {
          $(this).bind("click", function(){
            $(this).remove();
          })
        });
  });

  // Submit button clicked
  $('#submitButton').click(function() {
    // Logic to read input and post request here.
    $('#setup').remove();
    $('.board-table').css('visibility', 'visible')
  });

  $('.querySubTitle').click(function() {
    if ($(this).css('font-weight') == 'bold') {
      $(this).css('font-weight', 'normal');
    } else {
      $(this).css('font-weight', 'bold');
    }
  });

  // Buttons for choosing your cluster
  $('.clustButt').click(function() {
    var id = $(this).attr('id');
    var column = Number(id.substring(id.length-1, id.length))
    if (selectedCluster[column] != undefined) {
      if (selectedCluster[column] == id) {
        selectedCluster[column] = undefined;
      } else {
        $("#" + selectedCluster[column]).attr('aria-pressed', 'false');
        $("#" + selectedCluster[column]).removeClass('active');
      }
    }
    selectedCluster[column] = id;
  });

  // Button for the cluster Header
  $('.catHead').click(function() {
    var id = $(this).attr('id');
    var column = Number(id.substring(id.length - 1, id.length));
    var chosen = selectedCluster[column];
    if (chosen != undefined) {
      $("#" + chosen).attr('aria-pressed', 'false');
      $("#" + chosen).removeClass('active');
    }
    selectedCluster[column] = undefined;
  });
});


console.log('Module loaded')
angular.module('GameBoard', [])

.controller('Header', ['$scope', function($scope) {
  $scope.score = 0;
}])


.controller('gameCol', ['$scope', function($scope) {
  $scope.a = 1;
  $scope.b = 2;
}])
