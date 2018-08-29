// Global variables
const masterPool = []; // All collectible cards
const heroes = []; // The nine original heroes to represent classes
let selectedClass = ''; // User selected class
let filteredPool = []; // Pool of only Neutral and class cards matching selected class
const deck = []; // Drafted deck
let pickOptions = []; // The three cards in any one pick

const cardDisplay = document.getElementById('card-display');


document.addEventListener('DOMContentLoaded', () => {
  axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1', {
    headers: {
      'X-Mashape-Key': 'gAeuReVzM3mshLLX97GlEfieDYDep1H5yDOjsn5z5VlqqZie5Q'
    }
  }).then(response => {

    // First nine cards of data are the heroes. Add them to heroes array
    for (let i = 0; i < 9; i++) {
      heroes.push(response.data.Basic[i]);
    }

    // Iterate through all cards in data and push non-Hero cards to the master pool
    for (const set in response.data) {
      for (const card of response.data[set]) {
        if (card.type !== "Hero") {
          masterPool.push(card);
        }
      }
    }

    // Once the data has been processed, move on to the draft, starting with class
    classPick();
  });
});

// User chooses class
function classPick() {
  pickOptions = [];

  const selectedIndices = []; // To log indices and avoid duplicates
  let currentSelection = 0;

  // Build array of options for pick
  for (let i = 0; i < 3; i++) {
    do {
      currentSelection = Math.floor(Math.random() * 9);
    } while (selectedIndices.includes(currentSelection)); // Verify index has not already been selected
    selectedIndices.push(currentSelection);

    // Add randomly selected hero to pick
    pickOptions.push(heroes[currentSelection]);
  }

  renderPick(pickOptions);
  cardDisplay.addEventListener('click', classPickHandler);
}


function classPickHandler(e) {
  // Ensure target is a card image
  if (e.target && e.target.classList.contains("imgbtn")) {
    // Remove event listener so it only triggers once
    cardDisplay.removeEventListener('click', classPickHandler);

    // Use id of target to determine which option was selected
    const position = +e.target.id.slice(-1);

    selectedClass = pickOptions[position].playerClass;

    // Filter the master pool down to exclude all class cards that are not of chosen class
    filteredPool = masterPool.filter(card => card.playerClass === "Neutral" || card.playerClass === selectedClass);

    // Move flow of program to card picking stage
    cardPick();
  }
}


// User chooses a card
function cardPick() {
  pickOptions = [];

  const selectedIndices = []; // To log indices and avoid duplicates
  let currentSelection = 0;

  // Build array of options for pick
  for (let i = 0; i < 3; i++) {
    do {
      currentSelection = Math.floor(Math.random() * filteredPool.length);
    } while (selectedIndices.includes(currentSelection) && !twoAlready(filteredPool[currentSelection])); // Verify index has not already been selected and that two copies of card are not already in deck
    selectedIndices.push(currentSelection);

    // Add randomly selected card to pick
    pickOptions.push(filteredPool[currentSelection]);
  }

  renderPick(pickOptions);
  cardDisplay.addEventListener('click', cardPickHandler);
}

// Function that determines if given card is already a 2-of in the deck
function twoAlready(proposedCard) {
  let numInDeck = 0;
  for (const card of deck) {
    if (card.cardId === proposedCard.cardId) {
      numInDeck++;
      if (numInDeck === 2) {
        return true;
      }
    }
  }
  return false;
}

function cardPickHandler(e) {
  // Ensure target is a card image
  if (e.target && e.target.classList.contains("imgbtn")) {
    // Remove event listener to avoid multiple triggers
    cardDisplay.removeEventListener('click', cardPickHandler);

    // Use id of target to determine which option was selected
    const position = +e.target.id.slice(-1);

    // Add choosen card to deck
    deck.push(pickOptions[position]);

    sortDeck();
    // renderDeck();

    // Restart card pick process until 30 picks are made
    if (deck.length < 30) {
      cardPick();
    }

    // If 30 picks have been made, advance the flow of the program
    if (deck.length === 30) {
      deckComplete();
    }
  }

  // If user clicks red x indicating they don't own the card
  if (e.target && e.target.classList.contains("xbtn")) {
    // Removed unowned card and replace with new random card
    pickOptions.splice(+e.target.id.slice(-1) - 1, 1, filteredPool[Math.floor(Math.random() * filteredPool.length)]);
  }
}

// Sort first by cost, and then alphabetically by card name
function sortDeck() {
  deck.sort((cardA, cardB) => {
    if (cardA.cost < cardB.cost) {
      return -1;
    }
    if (cardA.cost > cardB.cost) {
      return 1;
    }
    return cardA.name.localeCompare(cardB.name);
  });
}

function  deckComplete() {
  console.log('Deck Complete');
  console.log(deck);
}




function renderPick(pickOptions) {
  for (let i = 0; i < 3; i++) {
    document.getElementById(`img${i}`).src = pickOptions[i].img;
  }
}

document.getElementById('choose-class').addEventListener('click', classPick);
document.getElementById('choose-card').addEventListener('click', cardPick);
