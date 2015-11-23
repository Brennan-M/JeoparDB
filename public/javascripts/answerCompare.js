
function isCorrect(response, answer) {

  answers = [];
  if (answer.indexOf("(") > -1 && answer.indexOf(")") > -1) {
    var start = answer.indexOf("(");
    var end = answer.indexOf(")");
    var answer1 = answer.substring(start+1, end);
    answer1.replace("accepted", "");
    answers.push(answer1.trim());
    var answer2 = answer.substring(0,start).concat(answer.substring(end+1));
    answers.push(answer2.trim());
  } else {
    answers.push(answer.trim());
  }

  for (var i = 0; i < answers.length; i++) {
    var correct = isCorrectHelper(response, answers[i]);
    if (correct == true) {
      return correct;
    }
  }

  return false;

};


function isCorrectHelper(response, answer) {
  response = response.toLowerCase();
  response = response.replace(/\'/g, "");
  response = response.replace(/\"/g, "");
  response = response.replace(/\\/g, "");
  response = response.replace(/\,/g, "");
  response = response.replace(/\./g, "");
  response = response.replace(/\-/g, "");
  response = response.replace(/\(/g, "");
  response = response.replace(/\)/g, "");
  answer = answer.toLowerCase();
  answer = answer.replace(/\'/g, "");
  answer = answer.replace(/\"/g, "");
  answer = answer.replace(/\\/g, "");
  answer = answer.replace(/\,/g, "");
  answer = answer.replace(/\./g, "");
  answer = answer.replace(/\-/g, "");
  answer = answer.replace(/\(/g, "");
  answer = answer.replace(/\)/g, "");

  answerArr = answer.split(" ");
  responseArr = response.split(" ");
  
  if (answerArr[0] == "a" || answerArr[0] == "an" || answerArr[0] == "or" || answerArr[0] == "the") {
    answerArr.shift();
  }

  if (responseArr[0] == "a" || responseArr[0] == "an" || responseArr[0] == "or" || responseArr[0] == "the") {
    responseArr.shift();
  }


  if (answerArr.length > responseArr.length) {
    return false;
  } else if (answerArr.length == response.Arrlength) {
    for (var i = 0; i < answer.length; i++) {
      if (!isSameWord(answerArr[i], responseArr[i])) {
        return false;
      }
    }
    return true;
  } else {
    var matchedCount = 0;
    for (var i = 0; i < answerArr.length; i++) {
      for (var j = 0; j < responseArr.length; j++) {
        if (isSameWord(answerArr[i], responseArr[j])) {
          matchedCount += 1;
        }
      }
    }
    if (matchedCount >= answerArr.length) {
      return true;
    }
    return false;
  } 
};


// Possible levenshtein algorithm?

function isSameWord(answer, response) {
  if ((answer == "&" && response == "and") || (response == "&" && answer == "and")) {
    return true;
  }

  var optionExists = (answer.indexOf("/") > -1);
  if (optionExists == true) {
    var ind = answer.indexOf("/");
    if (response == answer.substring(0, ind) || response == answer.substring(ind+1)) {
      return true;
    } else {
      return false;
    }
  } else {
    return (answer == response);
  }
};

