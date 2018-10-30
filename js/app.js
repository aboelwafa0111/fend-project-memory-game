/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


const deck = document.querySelector('.deck');
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;


// Create a list that holds all of your cards
function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}
shuffleDeck();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


// Check match 
const totalPairs = 8;

function checkForMatch() {
  if (toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggledCards = [];
    moves = moves - 1; // Dont add moves if a match
    matched = matched + 1;
    console.log('Two cards match!');
    if (matched === totalPairs) {
      gameOver();
    }
  } else {
    setTimeout(function () {
      console.log('Not a match!');
      toggleCard(toggledCards[0]);
      toggleCard(toggledCards[1]);
      toggledCards = [];
    }, 800);
  }
}


// moves card
function addMove() {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}


// add open & show class function
function toggleCard(clickTarget) {
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
}


// add card to array function
function addToggleCard(clickTarget) {
  toggledCards.push(clickTarget);
  console.log(toggledCards);

  if (clockOff) {
    startClock();
    clockOff = false;
  }
}

// Check Score
function checkScore() {
  if (moves === 14 || moves === 20) {
    hideStar();

  }
}


// Hide Stars
function hideStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}


//timer
function startClock() {

  clockId = setInterval(() => {
    time++;
    displayTime();
    console.log(time);

  }, 1000);
}


//Display time
function displayTime() {

  const clock = document.querySelector('.clock');

  clock.innerHTML = time;
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10) {
    clock.innterHTML = `${minutes}:0${seconds}`;

  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}


function stopClock() {

  clearInterval(clockId);
}

function resetGame() {
  resetClockAndTime();
}

function resetClockAndTime() {
  stopClock();
  clockOff = true;
  time = 0;
  displayTime();
}

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}


function resetStars() {
  stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}


function resetGame() {
  resetClockAndTime();
  resetCardClasses();
  resetMoves();
  resetStars();
  shuffleDeck();

}

function resetCardClasses() {
  $('li.card').removeClass('open show match');
}

function resetCards() {
  const cards = document.querySelectorAll('.deck li');
  for (let card of cards) {
    resetCardClasses();
  }
}

function gameOver() {
  stopClock();
  writeModalStats();
  toggleModal();
}

// replay game
function replayGame() {
  resetCardClasses();
  toggleModal();
}


// ====================== Modal ===================================


// querySelector Modal
document.querySelector('.restart').addEventListener('click', resetGame);
document.querySelector('.modal_replay').addEventListener('click', resetGame);
document.querySelector('.modal_replay').addEventListener('click', replayGame);


// toggleModal

function toggleModal() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}
toggleModal(); //Opens the modal
toggleModal(); //Closes the modal


function writeModalStats() {
  const timeStat = document.querySelector('.modal_time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  const starsStat = document.querySelector('.modal_stars');
  const stars = getStars();

  timeStat.innerHTML = `Time = ${clockTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 3;
  for (star of stars) {
    if (star.style.display === "none") {
      starCount--;
    }
  }
  console.log(starCount);
  return starCount;
}


document.querySelector('.modal_cancel').addEventListener('click', () => {
  toggleModal();
});


document.querySelector('.modal_replay').addEventListener('click', () => {
  console.log('replay');
  resetCardClasses();
});

// ================= Main function / click card action =========================

deck.addEventListener('click', event => {
  const clickTarget = event.target;
  displayTime();

  if (clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)) {
    toggleCard(clickTarget);
    addToggleCard(clickTarget);
    if (toggledCards.length === 2) {
      checkForMatch(clickTarget);
      addMove();
      checkScore();
    }
    console.log("Awesome");
  }
});