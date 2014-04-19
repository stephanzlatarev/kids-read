$(document).ready(function() {
  showText($("#exercise"), session.text);

  window.setTimeout(runExercise, 100);

  centerScreen("test");

  centerScreen("success");
  $("#success").click(function() { startExercise(); });

  centerScreen("tryagain");
  $("#tryagain").click(function() { showScreen("test"); });

  startExercise();
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
    var randomWordIndex = Math.floor(Math.random() * words.length);
    var randomWord = formatWord(words[randomWordIndex]);

    if ((randomWord != context.testWord) && (context.falseWords.indexOf(randomWord) < 0)) {
      context.falseWords.push(randomWord);
    }
  }

  context.response = null;

  exercise = exeriseWord();
}

function runExercise() {
  if (exercise && exercise[0] && (!exercise[0].check || exercise[0].check(context))) {
    exercise[0].execute(context);
    exercise = exercise.splice(1);
  }
  window.setTimeout(runExercise, 100);
}

function exeriseWord() {
  return [
    new ExerciseStep(null, function(context) {
        context.wordElement.removeClass("blurred").addClass("focused"); // highlight the exercised word
        context.time = new Date().getTime() + 3000; // set timer to 3 seconds
      }
    ),
    new ExerciseStep(
      function(context) {
        return new Date().getTime() > context.time; // check if timer is complete
      },
      function(context) {
        context.wordElement.removeClass("focused").addClass("blurred"); // restore style of exercised word

        var answers = [];
        answers.push(createAnswerTile(context.testWord)
                .click(function() {
                  context.response = "correct";
                  showSuccessMessage();
                }
              )
        );
        answers.push(createAnswerTile(context.falseWords[0])
                .click(function() {
                  context.response = "wrong";
                  showTryAgainMessage();
                }
              )
        );
        answers.push(createAnswerTile(context.falseWords[1])
                .click(function() {
                  context.response = "wrong";
                  showTryAgainMessage();
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
