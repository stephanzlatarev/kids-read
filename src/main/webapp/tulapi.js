$(document).ready(function() {
  showText($("#exercise"), session.text);

  window.setTimeout(runExercise, 100);

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
  for (var i = 0; i < 2; i++) {
    var randomWord = Math.floor(Math.random() * words.length);
    context.falseWords.push(formatWord(words[randomWord]));
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

        // TODO: randomize the order of answers
        $("#answer1").empty().append($("<a href='#'>").text(context.falseWords[0]).click(function() {
          context.response = "wrong";
          showTryAgainMessage();
        }));
        $("#answer2").empty().append($("<a href='#'>").text(context.testWord).click(function() {
          context.response = "correct";
          showSuccessMessage();
        }));
        $("#answer3").empty().append($("<a href='#'>").text(context.falseWords[1]).click(function() {
          context.response = "wrong";
          showTryAgainMessage();
        }));

        showScreen("test");
      }
    )
  ];
}

function showSuccessMessage() {
  $("#success a").click(function() { startExercise(); });

  showScreen("success");
}

function showTryAgainMessage() {
  $("#tryagain a").click(function() {
    $("#tryagain").hide();
    $("#test").show();
  });

  showScreen("tryagain");
}

function formatWord(word) {
  return word.toLowerCase().split(",")[0].split(".")[0];
}
