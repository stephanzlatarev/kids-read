$(document).ready(function() {
  showText($("#exercise"), session.text);

  centerScreen("exercise");
  $("#exercise").click(function() { Timer.setTimer(1); });

  centerScreen("test");

  centerScreen("success");
  $("#success").click(function() { startExercise(); });

  centerScreen("tryagain");
  $("#tryagain").click(function() { showScreen("test"); });

  startExercise();

  window.setInterval(runExercise, 100);
});

var words = [];

function showText(view, text) {
  view.empty();

  words = text.split(" ");
  for (w in words) {
    view.append($("<span>").addClass("word").addClass("blurred").attr("id", "word" + w).html(words[w]));
  }
}

function showScreen(screenId) {
  $(".screen").hide();
  $("#" + screenId).show();
}

function centerScreen(screenId) {
  $("#" + screenId).css("top", "20px").css("left", "20px")
    .width(($(window).width() - 40) + "px").height(($(window).height() - 40) + "px");
}

// Exercise functions
var context = {};
var exercise = [];

function ExerciseStep(condition, action) {
  this.check = condition;
  this.execute = action;
}

function startExercise() {
  showScreen("exercise");

  // TODO: select a word to test. Use session contents
  var randomWord = Math.floor(Math.random() * words.length);
  context.wordElement = $("#word" + randomWord);
  context.testWord = formatWord(words[randomWord]);

  // TODO: select similar words. Again, use session contents
  context.falseWords = [];
  while (context.falseWords.length < 2) {
    var randomWord = tweakWord(context.testWord);

    if ((randomWord != context.testWord) && (context.falseWords.indexOf(randomWord) < 0)) {
      context.falseWords.push(randomWord);
    }
  }

  context.response = null;
  context.step = 0;

  exercise = exeriseWord();
}

function tweakWord(word) {
  var at =  Math.floor(Math.random() * word.length);
  var c = String.fromCharCode(97 + Math.round(Math.random() * 25));
  return word.substr(0, at) + c + word.substr(at + 1);
}

function runExercise() {
  if (!exercise[context.step].check || exercise[context.step].check(context)) {
    exercise[context.step++].execute(context);
  }
}

function exeriseWord() {
  return [
    new ExerciseStep(null, function(context) {
        Timer.clearTimer();
        context.wordElement.removeClass("blurred").addClass("focused"); // highlight the exercised word
      }
    ),
    new ExerciseStep(
      function(context) {
        return Timer.isTimeUp();
      },
      function(context) {
        Timer.clearTimer();
        context.wordElement.removeClass("focused").addClass("blurred"); // restore style of exercised word

        var answers = [];
        answers.push(createAnswerTile(context.testWord)
                .click(function() {
                  context.response = "correct";
                  showSuccessMessage();
                  Timer.setTimer();
                }
              )
        );
        answers.push(createAnswerTile(context.falseWords[0])
                .click(function() {
                  context.response = "wrong";
                  showTryAgainMessage();
                  Timer.setTimer();
                }
              )
        );
        answers.push(createAnswerTile(context.falseWords[1])
                .click(function() {
                  context.response = "wrong";
                  showTryAgainMessage();
                  Timer.setTimer();
                }
              )
        );

        $("#answers").empty();
        while (answers.length > 0) {
          var ai = Math.floor(answers.length * Math.random());
          var a = answers.splice(ai, 1);
          $("#answers").append(a);
        }

        showScreen("test");
      }
    ),
    new ExerciseStep(
      function(context) {
        return Timer.isTimeUp();
      },
      function(context) {
        if (context.response == "correct") {
          startExercise();
        } else {
          context.step -= 2;
        }
      }
    )
  ];
}

function showSuccessMessage() {
  showScreen("success");
}

function showTryAgainMessage() {
  showScreen("tryagain");
}

function formatWord(word) {
  return word.toLowerCase().split(",")[0].split(".")[0];
}

function createAnswerTile(word) {
  var tileSpace = ($('body').innerWidth() - 50) / 3 - 8; // minus 2x border = 8px
  var tileUnit = Math.floor(tileSpace / 14);
  var width = tileUnit * 10;
  var padding = tileUnit;
  var margin = tileUnit;
  var fontSize = Math.floor(100 * width / 100);

  return $("<div>").addClass("answer").addClass("focused")
    .css("width", "" + width + "px")
    .css("margin", "" + margin + "px")
    .css("padding", "" + padding + "px")
    .css("font-size", "" + fontSize + "%")
    .html(word)
    .append("<img src='pics/paw.jpg' width='50px' style='display: block; margin: 50px auto;' />");
}

// Timer functions
var Timer = new function() {

  this.time = Number.MAX_VALUE;

  this.isTimeUp = function() {
    return new Date().getTime() > Timer.time;
  }

  this.clearTimer = function() {
    Timer.time = Number.MAX_VALUE;
  }

  this.setTimer = function(millis) {
    Timer.time = new Date().getTime() + ((millis) ? millis : 1500);
  }

}
