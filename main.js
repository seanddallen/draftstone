///////////////////////// GLOBAL VARIABLES /////////////////////////

const masterPool = []; // All collectible cards
const heroes = []; // The nine original heroes to represent classes
let selectedClass = ''; // User selected class
let filteredPool = []; // Pool of only Neutral and class cards matching selected class
const deck = []; // Drafted deck
let pickOptions = []; // The three cards in any one pick
const cardDisplay = document.getElementById('card-display');


///////////////////////// GET DATA /////////////////////////

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


///////////////////////// PICK CLASS /////////////////////////


function renderPick(array) {
  img0 = document.getElementById('img0');
  img1 = document.getElementById('img1');
  img2 = document.getElementById('img2');

  //append 3 images
  img0.innerHTML = `<img id="img0" class="responsive" src="${array[0].img}" alt="">`
  img1.innerHTML = `<img id="img1" class="responsive" src="${array[1].img}" alt="">`
  img2.innerHTML = `<img id="img2" class="responsive" src="${array[2].img}" alt="">`
}

// const sampleDeck3 = [{"cardId":"EX1_162","dbfId":"985","name":"Dire Wolf Alpha","cardSet":"Classic","type":"Minion","faction":"Neutral","rarity":"Common","cost":2,"collectible":true,"playerClass":"Neutral","img":"http://media.services.zam.com/v1/media/byName/hs/cards/enus/EX1_162.png"},{"cardId":"EX1_044","dbfId":"791","name":"QuestingAdventurer","cardSet":"Classic","type":"Minion","faction":"Alliance","rarity":"Rare","cost":3,"attack":2,"health":2,"text":"Whenever you play a card, gain +1/+1.","flavor":"\"Does anyone have some extra Boar Pelts?\"","artist":"Attila Adorjany","collectible":true,"playerClass":"Neutral","img":"http://media.services.zam.com/v1/media/byName/hs/cards/enus/EX1_044.png"},{"cardId":"OG_161","dbfId":"38545","name":"Corrupted Seer","cardSet":"Whispers of the Old Gods","type":"Minion","rarity":"Rare","cost":6,"collectible":true,"race":"Murloc","playerClass":"Neutral","img":"http://media.services.zam.com/v1/media/byName/hs/cards/enus/OG_161.png"}];
//
// renderPick(sampleDeck3);

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
  hide = document.getElementById('hide');
  hide.classList.remove('hidden'); 

  renderPick(pickOptions);
  cardDisplay.addEventListener('click', classPickHandler);
}


function classPickHandler(e) {
  // Ensure target is a card image
  if (e.target && e.target.id.includes("img")) {

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

///////////////////////// PICK DECK /////////////////////////

// User chooses a card
function cardPick() {
  pickOptions = [];

  const selectedIndices = []; // To log indices and avoid duplicates
  let currentSelection = 0;

  // Build array of options for pick
  for (let i = 0; i < 3; i++) {
    do {
      currentSelection = Math.floor(Math.random() * filteredPool.length);
    } while (selectedIndices.includes(currentSelection) || twoAlready(filteredPool[currentSelection])); // Verify index has not already been selected and that two copies of card are not already in deck
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
  if (e.target && e.target.id.includes("img")) {
    // Remove event listener to avoid multiple triggers
    cardDisplay.removeEventListener('click', cardPickHandler);

    // Use id of target to determine which option was selected
    const position = +e.target.id.slice(-1);

    // Add choosen card to deck
    deck.push(pickOptions[position]);

    sortDeck();
    renderDeck(deck);

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
    if (e.target && e.target.id.includes("xbtn")) {
      // Removed unowned card and replace with new random card
      let newOption = filteredPool[Math.floor(Math.random() * filteredPool.length)];

      // TODO: Ensure that the newOption is not the same as one of the curent options
      while (twoAlready(newOption)) {
        newOption = filteredPool[Math.floor(Math.random() * filteredPool.length)];
      }
      pickOptions.splice(+e.target.id.slice(-1) - 1, 1, newOption);
      renderPick(pickOptions);
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

function renderDeck(array) {
  cardName = document.getElementById('card-name');
  cardCost = document.getElementById('card-cost');
  cardName.innerHTML = '';
  cardCost.innerHTML = '';

  array.forEach(function(card) {
    cardName.innerHTML += `
      <div class="flex name-style">
        ${card.name}
      </div>
    `
  })

  array.forEach(function(card) {
    cardCost.innerHTML += `
      <div class="flex cost-style">
        ${card.cost}
      </div>
    `
  })
}



///////////////////////// COMPLETE DECK /////////////////////////

function deckComplete() {
  console.log('Deck Complete');
  console.log(deck);
}
