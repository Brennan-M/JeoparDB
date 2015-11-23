// Constants
var NUM_COLS = 5;

// Global vars
var selectedCluster = [];
for (var i = 0; i < NUM_COLS; i++) {
  selectedCluster.push(undefined);
}

// ---------------------Helper functions----------------------

// Apply error message for an invalid date
function applyInvalidDate(col) {
  var errorMsg = "<p style='color: red; font-size: 14px;' class='errorMsg'"
      + " id='em" + col.toString() + "'> Invalid date (mm/dd/yyyy)</p>";
  $('#date' + col.toString()).append(errorMsg);
}

// Check if a date is correct
function checkDate(date) {
  if (date.length == 0) {
    return true;
  }
  if (date.length != 10) {
    return false;
  }
  // This weird if structure accounts for NaN
  var month = Number(date.substring(0, 2));
  if (month > 0 && month < 13) {
    var day = Number(date.substring(3, 5));
    if (day > 0 && day < 31) {
      var year = Number(date.substring(6, 10));
      if (year > 0) {
        return true;
      }
    }
  }
  return false;
}

//Get the info filled out by the user returns false if invalid info
function getInfoForCol(col) {
  var toReturn = []; // startDate, endDate, cluster
  var startDate = $('#startDate' + col.toString()).val();
  if (!checkDate(startDate)) {
    applyInvalidDate(col);
    return false;
  }
  var endDate = $('#endDate' + col.toString()).val();
  if (!checkDate(endDate)) {
    applyInvalidDate(col);
    return false;
  }
  toReturn.push(startDate);
  toReturn.push(endDate);
  if (selectedCluster[col] == undefined) {
    toReturn.push(undefined);
  } else {
    var tag = selectedCluster[col].substring(0,2);
    if (tag == "mi") {
      toReturn.push("Miscellaneous");
    } else if (tag == "wp") {
      toReturn.push("Word Play");
    } else if (tag == "ss") {
      toReturn.push("Social Sciences")
    } else if (tag == "pc") {
      toReturn.push("Pop Culture");
    } else if (tag == "ar") {
      toReturn.push("Art and Media");
    } else {
      toReturn.push("Science");
    }
  }
  return toReturn;
}

// ------------------- Handlers -----------------------
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
    $('.errorMsg').remove();
    // Logic to read input and post request here.
    var dataToSend = [];
    var invalidData = false;
    for (var i = 0; i < NUM_COLS; i++) {
      colInfo = getInfoForCol(i);
      if (! colInfo) {
        invalidData = true;
      } else {
        dataToSend.push(colInfo);
      }
    }
    console.log(dataToSend);
    if (invalidData) {
      return;
    }
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

  // Button for date Header
  $('.dateHead').click(function() {
    var id = $(this).attr('id');
    var column = Number(id.substring(id.length - 1, id.length));
    console.log('#em' + column.toString());
    $('#em' + column.toString()).remove();
    $('#startDate' + column.toString()).val("");
    $('#endDate' + column.toString()).val("");
  });
});

// ----------------------- Angular JS stuff ---------------

console.log('Module loaded')
angular.module('GameBoard', [])

.controller('Header', ['$scope', function($scope) {
  $scope.score = 0;
}])


.controller('gameCol', ['$scope', function($scope) {
  $scope.a = 1;
  $scope.b = 2;
}])
