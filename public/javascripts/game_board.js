// Constants
var NUM_COLS = 5;

// Global vars
var selectedCluster = [];
for (var i = 0; i < NUM_COLS; i++) {
  selectedCluster.push(undefined);
}
var questions = [];
for (var i = 0; i < NUM_COLS; i++) {
  questions.push(undefined);
}
var toAddToScore = undefined;
var currScore = 0;

var questionsAnswered = 0;

// ---------------------Helper functions----------------------

// Apply error message for an invalid date
function applyInvalidDate(col) {
  var errorMsg = "<p style='color: red; font-size: 14px;' class='errorMsg'"
      + " id='em" + col.toString() + "'> Invalid date, Range: (1984-2012)</p>";
  $('#date' + col.toString()).append(errorMsg);
}

// Check if a date is correct
function checkDate(date) {
  if (date.length == 0) {
    return true;
  }
  if (date.length != 4) {
    return false;
  }
  // This weird if structure accounts for NaN
  var year = Number(date);
  if (year < 1984 || year > 2012) {
    return false;
  }
  return true;
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
  console.log(toReturn);
  if (selectedCluster[col] == undefined) {
    toReturn.push("");
  } else {
    var tag = selectedCluster[col].substring(0,2);
    if (tag == "mi") {
      toReturn.push("Misc");
    } else if (tag == "wp") {
      toReturn.push("Wordplay");
    } else if (tag == "ss") {
      toReturn.push("Social Science");
    } else if (tag == "ap") {
      toReturn.push("Art/Pop Culture");
    } else {
      toReturn.push("Science");
    }
  }
  return toReturn;
}

function updateScore() {
  currScore += toAddToScore;
  toAddToScore = undefined;
  $('#scoreNum').text(currScore.toString());
  if (currScore < 0) {
    $('#scoreNum').css("color", "red");
  } else {
    $('#scoreNum').css("color", "white");
  }
}

function displayEndGame() {
  console.log("Triggered!");
  if (currScore > 0) {
    console.log(team);
    $.post('/updateGlobal', {"score": currScore, 
        "team": team}, function(res) { 
     });
  }

  var score10 = getLeaders();
  if (currScore >= score10){
    $('#finalMessage').append("You're in our top 10 earners! Enter your name to be added to our leaderboard!");
    $('#leaderboard-input').css("visibility", "visible");
  } else if (currScore > 0) {
    $('#finalMessage').append("Congradulations! You're walking away with $"
        + currScore.toString());
  } else {
    $('#finalMessage').append("Sorry you didn't get any money.");
  }

	$('#endGameModal').modal();
}

function getLeaders(){
  console.log("LEADERS!");
  var score10 = 0;
  $.get('/getLeaders', function(data) {
        $('#leaderboards').empty();
        $('#leaderboards').append('<h5> Leaderboards </h5><table>');
        for(var i = 0; i < data.length; i++){
          $('#leaderboards').append("<tr><td id='leader-cell'>" + data[i].Fullname + "</td><td>" + data[i].Score + "</td></tr>");
        }
        $('#leaderboards').append('</table>');
        score10 = data[9].Score;
    });
  return score10;
}

function submitName(id){
  var name = document.getElementById(id).value;
  $('#finalMessage').empty();
  $.post('/addLeader', {"Name": name, "Score": currScore},
      function(data) {
        console.log(data);
    });
  getLeaders();
}

function makeSubmitListener(row, col) {
  return function(){
    if (toAddToScore != undefined) {
      return;
    }
    var entered = $('#answerText').val();
    var answer = questions[col][row]['Answer'];
    var correct = isCorrect(entered, answer);
    $('#questionSubmit').prop('disabled', 'true');
    $('#questionPass').prop('disabled', 'true');
    $('#questionPass').off('click');
    $('#CorrectAnswer').append("Answer: " + answer);
    var status = undefined;
    if (correct) {
      status = "correct";
      $('#Feedback').append("Correct!");
      $('#Feedback').css('color', '#ffcc66');
      toAddToScore = 200 * (row + 1);
    } else {
      status = "wrong";
      $('#Feedback').append("Wrong!");
      $('#Feedback').css('color', 'red');
      toAddToScore = -200 * (row + 1);
    }
    $.post('/update', {"questionId": questions[col][row]['QuestionId'], "status": status},
      function(data) {
        console.log(data);
    });
    $("#continueButton").css("visibility", "visible");
    $('#continueButton').bind("click", function() {
      updateScore();
      $('.Question').remove();
      if (questionsAnswered == 25) {
        displayEndGame();
      }
    });
  }
}

// ------------------- Handlers -----------------------
$(document).ready(function() {
  // Question click
  $('.qBox').click(function() {
    $(this).empty();
    $(this).off("click");
    $(this).removeClass("qBox");
    $(this).addClass("clickedQBox")
    questionsAnswered++;
    var h = $(this).height();
    var w = $(this). width();
    var posn = $(this).offset();
    var id = $(this).attr('id');
    var row = Number(id.substring(1, 2));
    var col = Number(id.substring(2, 3));
    $("body").append("<div class='Question' "
        + "style='background-color: #0000A0; position: fixed; z-index: 1;"
        + "top: " + ((posn['top'] + h/2).toString() + "px")
        + "; left: " + ((posn['left'] + w/2).toString() + "px") + "; "
        + "height: " + h + "; width: " + w +"; "
        + "border: 1px solid white'"
        + "></div>");
    var offset = $('.Question').offset();
    $(".Question").animate({height: "100%",
        width: "100%",
        "top": ("-=" + offset['top'].toString() + "px"),
        "left": ("-=" + offset['left'].toString() + "px")},
        "slow", function() {
          $(this).load('/templates/question.html #QuestionBox', "", function() {
            $("#QuestionText").append(questions[col][row]['Question']);
            $("#questionCluster").append(questions[col][row]['Cluster']);
            $("#answerText").focus();
            $.post('/getStats', {"questionId": questions[col][row]['QuestionId']},
              function(data) {
                var percentage = data[0]["CorrectCount"]*1.0/data[0]["AskedCount"];
                if (isNaN(percentage)) {
                  $("#Statistics").append("You are the first person to be asked this question!");
                } else {
                  percentage *= 100.0;
                  percentage = (percentage).toFixed(1);
                  $("#Statistics").append(percentage);
                  $("#Statistics").append("% of players answered this question correctly.");
                }
            });
            $("#questionSubmit").bind("click", makeSubmitListener(row, col));
            $("#answerText").keydown(function(event) {
              if (event.which == 13) {
                (makeSubmitListener(row, col))();
              }
            });
      	    $("#questionPass").bind("click", function() {
      	      toAddToScore = 0;
      	      $('#questionSubmit').prop('disabled', 'true');
          	      $('#questionPass').prop('disabled', 'true');
      	      var answer = questions[col][row]['Answer'];
      	      $('#CorrectAnswer').append("Answer: " + answer);
      	      $("#continueButton").css("visibility", "visible");
       	      $('#continueButton').bind("click", function() {
        		    updateScore();
        		    $('.Question').remove();
                if (questionsAnswered == 25) {
                  displayEndGame();
                }
      	      });
              // TODO: I am not sure we want to count this as wrong. Maybe just not record.
              $.post('/update', {"questionId": questions[col][row]['QuestionId'], "status": "wrong"},
                function(data) {
                  console.log(data);
              });
      	    });
          });
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
    if (invalidData) {
      return;
    }
    var responseCounter = 0;
    for (var i = 0; i < NUM_COLS; i++) {
      (function(colNum) {
        $.post('/search', {"startDate": dataToSend[i][0],
                           "endDate": dataToSend[i][1],
                           "cluster": dataToSend[i][2]}, function(res) {
             questions[colNum] = res;
             $('#h' + colNum.toString()).text(res[0]['Category']);
             responseCounter++;
             if (responseCounter == 5) {
               $('#setup').remove();
               $('.board-table').css('visibility', 'visible');
             }
           });
       })(i);
    }
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

  // Done with game button
  $('#doneWithGame').click(function() {
    var currLocation = location.href;
    location.href = currLocation.substring(0, currLocation.indexOf("game"));
  });
});

// ----------------------- Angular JS stuff ---------------

console.log('Module loaded')
angular.module('GameBoard', [])

.controller('gameCol', ['$scope', function($scope) {
  $scope.a = 1;
  $scope.b = 2;
}])
