$(function () {
  $(document).on("dbClick", function (event) {
    event.preventDefault();
  });
  $(document).on("contextmenu", function (event) {
    event.preventDefault();
  });
});

var score = 0;
var color = "blue";
var runGame;

const smashSound = new Audio();
smashSound.src = "sounds/crash.mp4";

function random(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// function setBG() {
//   if (Math.round(Math.random())) {
//     return "http://icons.iconarchive.com/icons/hopstarter/halloween-avatars/128/Frankenstein-icon.png";
//   } else {
//     return "http://icons.iconarchive.com/icons/hopstarter/halloween-avatars/128/Scream-icon.png";
//   }
// }

function dropBox() {
  var length = random(100, $(".game").width() - 100);
  var velocity = random(1000, 10000);
  var size = random(50, 150);
  var thisBox = $("<div/>", {
    class: "box",
    style: "width:" + size + "px; height:" + size + "px; left:" + length + "px; transition: transform " + velocity + "ms linear;",
  });
  thisBox.css({ background: "url('imgs/fat.png')", "background-size": "contain", "background-repeat": "no-repeat" });

  //set data and bg based on data
  // thisBox.data("test", Math.round(Math.random()));
  // if (thisBox.data("test")) {
  // } else {
  //   // thisBox.css({"background": "url('http://icons.iconarchive.com/icons/hopstarter/halloween-avatars/128/Scream-icon.png')", "background-size":"contain"});
  //   thisBox.css({ background: "url('imgs/fat.png')", "background-size": "contain", "background-repeat": "no-repeat" });
  // }

  //insert gift element
  $(".game").append(thisBox);

  //random start for animation
  setTimeout(function () {
    thisBox.addClass("move");
  }, random(0, 5000));

  //remove this object when animation is over
  thisBox.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function (event) {
    $(this).remove();
  });
}

$(document).on("click", function (eInfo) {
  let fatsElement;
  if (eInfo.target.id == "glovesImage") {
    fatsElement = [...document.elementsFromPoint(eInfo.clientX, eInfo.clientY)].find((el) => el.classList.contains("box"));
    if (!fatsElement || fatsElement.classList.contains("smashed")) {
      return;
    }
  } else if (eInfo.target.classList.contains("box") && !eInfo.target.classList.contains("smashed")) {
    fatsElement = eInfo.target;
  } else {
    return;
  }
  smashSound.play();
  hitBox(eInfo.clientX, eInfo.clientY);
  $(fatsElement).addClass("smashed");
  $(fatsElement).css("backgroundImage", "url('imgs/crashing-fats.gif')");
  $(fatsElement).fadeOut(800);
  score++;
  $(".points").html((score < 10 ? "0" : "") + String(score));
});

function hitBox(clientX, clientY) {
  var xPosition = clientX - $(".gloves")[0].clientWidth / 2;
  var yPosition = clientY - $(".gloves")[0].clientHeight / 2;
  $(".gloves").css({
    left: xPosition + "px",
    top: yPosition + "px",
    bottom: "unset",
    transform: "unset",
  });
  $(".gloves img").attr("src", "imgs/boxing_v1.gif");
  setTimeout(function () {
    $(".gloves img").attr("src", "imgs/glove.png");
  }, 500);

  // setTimeout(function () {
  //   $(".gloves").css({
  //     left: 500 + "px",
  //     top: "unset",
  //     bottom: 0 + "px",
  //     // transform: " translate(-50%, 0)",
  //   });
  // }, 200);
}

function countdown() {
  var seconds = 15;
  function tick() {
    var counter = document.getElementById("counter");
    seconds--;
    counter.innerHTML = (seconds < 10 ? "0" : "") + String(seconds);
    if (seconds > 0) {
      setTimeout(tick, 1000);
      // draw();
      // update();
    } else {
      // alert("Game over");
      $(".final-score").html(score * 5);
      $(".game").hide();
      $(".result").show();
      clearInterval(runGame);
    }
  }
  tick();
}

$(".reset").click(resetGame);
function resetGame() {
  score = "00";
  $(".points").html(score);
  $(".gloves").css({
    left: "45%",
    top: "80%",
  });
  $(".box").remove();
  $(".result").hide();
  $(".home").show();
}

$(".start").click(startGame);
function startGame() {
  $(".home").hide();
  $(".game").show();
  for (i = 0; i < 10; i++) {
    dropBox();
  }
  runGame = setInterval(function () {
    for (i = 0; i < 10; i++) {
      dropBox();
    }
  }, 5000);
  countdown();
}
