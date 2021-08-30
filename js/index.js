// Implement instant loss, don't wait for playerSays.length === round

// Starting variables
var simonSays = [];
var playerSays = [];
var simonSequence = "";
var playerSequence = "";
var round = 1; // the 'level' of the game, max 20
var press = 0; // the index of simonSays array, i.e. simon's pad presses
var mode = "safe"; // safe / strict

// Sound files
var greenBoop = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
);
var redBoop = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
);
var yellowBoop = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
);
var blueBoop = new Audio(
  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
);
var scream = new Audio(
  "http://soundbible.com/mp3/Female_Scream_Horror-NeoPhyTe-138499973.mp3"
);
var cheer = new Audio(
  "http://soundbible.com/mp3/Kids%20Cheering-SoundBible.com-681813822.mp3"
);

// pad flash functions

function greenPad() {
  $(".tl").css("background-color", "rgba(150, 255, 150, 1)");
  setTimeout(function () {
    $(".tl").css("background-color", "green");
  }, 1000);
  greenBoop.play();
}

function redPad() {
  $(".tr").css("background-color", "rgba(255, 150, 150, 1)");
  setTimeout(function () {
    $(".tr").css("background-color", "red");
  }, 1000);
  redBoop.play();
}

function yellowPad() {
  $(".bl").css("background-color", "rgba(255, 255, 150, 1)");
  setTimeout(function () {
    $(".bl").css("background-color", "yellow");
  }, 1000);
  yellowBoop.play();
}

function bluePad() {
  $(".br").css("background-color", "rgba(150, 150, 255, 1)");
  setTimeout(function () {
    $(".br").css("background-color", "blue");
  }, 1000);
  blueBoop.play();
}

// populate simonSays

function simonSayWhat() {
  simonSays = [];
  for (var i = 0; i < 20; i++) {
    simonSays.push(Math.floor(Math.random() * 4) + 1);
  }
}

// simon's go
// the recursive pattern to ensure the 1 second wait works is modified from http://stackoverflow.com/a/3583740/1841605

function simonPlays() {
  setTimeout(function () {
    if (simonSays[press] === 1) {
      greenPad();
    } else if (simonSays[press] === 2) {
      redPad();
    } else if (simonSays[press] === 3) {
      yellowPad();
    } else if (simonSays[press] === 4) {
      bluePad();
    }
    press++;
    if (press < round) {
      simonPlays();
    }
  }, 1500);
}

// check player attempt against simonSays

function checkSequence() {
  simonSequence = simonSays.slice(0, round).join("");
  playerSequence = playerSays.join("");
  if (simonSequence === playerSequence) {
    return true;
  } else {
    return false;
  }
}

function playReset() {
  press = 0;
  playerSays = [];
}

function gameReset() {
  playReset();
  round = 1;
  $(".display").text("01");
  simonSayWhat();
}

function displayUpdate() {
  if (round < 10) {
    $(".display").text("0" + round);
  } else {
    $(".display").text(round);
  }
}

//urgh...DRY...DRY
function nextRound() {
  if (round < 9) {
    if (playerSays.length === round) {
      if (checkSequence()) {
        round++;
        displayUpdate();
        playReset();
        simonPlays();
      } else {
        if (mode === "safe") {
          $(".display").text("?!");
          playReset();
          setTimeout(displayUpdate, 1000);
          setTimeout(simonPlays, 500);
        } else {
          $(".display").text("XX");
          scream.play();
        }
      }
    }
  } else if (playerSays.length === round && round === 9) {
    if (checkSequence()) {
      $(".display").text(":)");
      $(".instruction").text("⎺⎺▽▽✡Iggⓨ✡▽▽⎺⎺");
      cheer.play();
    } else {
      if (mode === "safe") {
        $(".display").text("?!");
        playReset();
        setTimeout(displayUpdate, 1000);
        setTimeout(simonPlays, 500);
      } else {
        $(".display").text("XX");
        scream.play();
      }
    }
  }
}

// trigger boops on click

$("#1").on("click", function () {
  greenPad();
  playerSays.push(1);
  nextRound();
});

$("#2").on("click", function () {
  redPad();
  playerSays.push(2);
  nextRound();
});

$("#3").on("click", function () {
  yellowPad();
  playerSays.push(3);
  nextRound();
});

$("#4").on("click", function () {
  bluePad();
  playerSays.push(4);
  nextRound();
});

$("#start-button").on("click", function () {
  gameReset();
  simonPlays();
});

$("#strict-button").on("click", function () {
  if (mode === "safe") {
    $("#strict-button").css({
      "background-color": "rgb(217, 0, 0)",
      color: "yellow",
    });
    mode = "strict";
  } else {
    $("#strict-button").css({
      "background-color": "rgb(217, 83, 79)",
      color: "white",
    });
    mode = "safe";
  }
});
