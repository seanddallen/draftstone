///////////////////////// GLOBAL VARIABLES /////////////////////////
const masterPool = JSON.parse(localStorage.getItem("masterPool"));
const heroes = JSON.parse(localStorage.getItem("heroes"));
const custom = JSON.parse(localStorage.getItem("custom"));
const customRules = JSON.parse(localStorage.getItem("customRules"));
let heroCard = {};
let selectedClass = ''; // User selected class
let filteredPool = masterPool; // Pool of only Neutral and class cards matching selected class
const deck = []; // Drafted deck
let pickOptions = []; // The three cards in any one pick
const cardDisplay = document.getElementById('card-display');
//const setArray = ["Basic", "Classic", "Hall of Fame", "Naxxramas", "Goblins vs Gnomes", "Blackrock Mountain", "The Grand Tournament", "The League of Explorers", "Whispers of the Old Gods", "One Night in Karazhan", "Mean Streets of Gadgetzan", "Journey to Un'Goro", "Knights of the Frozen Throne", "Kobolds & Catacombs", "The Witchwood", "The Boomsday Project"]; // Stores sets chosen by user
const setArray = JSON.parse(localStorage.getItem("chosenSets"));
let pools = {
  'neutral': {
    'minion': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': []
    },
    'spell': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': []
    }
  },
  'class': {
    'minion': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': []
    },
    'spell': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': []
    }
  }
};
const randomClass = [];
const randomType = [];
const randomRarity = [];
const blankCard = {
            "cardId": "",
            "dbfId": "",
            "name": "Blank Card",
            "cardSet": "The League of Explorers",
            "type": "Minion",
            "rarity": "Legendary",
            "cost": 0,
            "attack": 2,
            "health": 4,
            "text": "Your <b>Battlecries</b> trigger twice.",
            "flavor": "Contains 75% more fiber than his brother Magni!",
            "artist": "Sam Nielson",
            "collectible": true,
            "elite": true,
            "playerClass": "Neutral",
            "howToGet": "Unlocked in Uldaman, in the League of Explorers adventure.",
            "howToGetGold": "Crafting unlocked in Uldaman, in the League of Explorers adventure.",
            "img": "./blank_card.png",
            "imgGold": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_077_premium.gif",
            "locale": "enUS",
            "mechanics": []
        }


////////////////////////
///////////////////////// GET DATA /////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  if (setArray[0] !== "All") {
    filterPoolBySet(setArray);
  }
  classPick();
});
function filterPoolBySet(setArray) {
  filteredPool =  filteredPool.filter(card => setArray.includes(card.cardSet));
}
function setupCustom() {
    for (let i = 0, numCards = filteredPool.length; i < numCards; i++) {
      const currentCard = filteredPool[0];
      const cardClass = currentCard.playerClass === "Neutral" ? 'neutral' : 'class';
      const cardType = currentCard.type === "Minion" ? 'minion' : 'spell';
      const cardRarity = currentCard.rarity === "Free" ? 'Common' : currentCard.rarity;
      pools[cardClass][cardType][cardRarity].push(filteredPool.shift());
    }
    for (let i = 0; i < customRules.classCount; i++) {
      randomClass.push("class");
    }
    while (randomClass.length < 30) {
      randomClass.push("neutral");
    }
    for (let i = 0; i < customRules.spellCount; i++) {
      randomType.push("spell");
    }
    while (randomType.length < 30) {
      randomType.push("minion");
    }
    for (let i = 0; i < customRules.legendaryCount; i++) {
      randomRarity.push("Legendary");
    }
    for (let i = 0; i < customRules.epicCount; i++) {
      randomRarity.push("Epic");
    }
    for (let i = 0; i < customRules.rareCount; i++) {
      randomRarity.push("Rare");
    }
    while (randomRarity.length < 30) {
      randomRarity.push("Common");
    }
}
///////////////////////// PICK CLASS /////////////////////////
function renderPick(array) {
  img0 = document.getElementById('img0');
  img1 = document.getElementById('img1');
  img2 = document.getElementById('img2');
  //append 3 images
  img0.innerHTML = `<img id="img0" class="responsive" src="${array[0].img}" alt="">`;
  img1.innerHTML = `<img id="img1" class="responsive" src="${array[1].img}" alt="">`;
  img2.innerHTML = `<img id="img2" class="responsive" src="${array[2].img}" alt="">`;
}
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
    filteredPool = filteredPool.filter(card => card.playerClass === "Neutral" || card.playerClass === selectedClass);
    if (custom) {
      setupCustom();
    }
    renderClassName();
    // Move flow of program to card picking stage
    cardPick();
  }
}
///////////////////////// PICK DECK /////////////////////////
function randomPickSettings() {
  const settingsArray = [];
  settingsArray.push(randomClass.splice(Math.floor(Math.random() * randomClass.length), 1)[0]);
  settingsArray.push(randomType.splice(Math.floor(Math.random() * randomType.length), 1)[0]);
  settingsArray.push(randomRarity.splice(Math.floor(Math.random() * randomRarity.length), 1)[0]);
  if (settingsArray[0] === "neutral" && settingsArray[1] === "spell") {
    let randomTypeIndex = randomType.indexOf("minion");
    if (randomTypeIndex === -1) {
      console.log("not enough class spells");
      settingsArray[1] = "minion";
    } else {
      settingsArray[1] = randomType.splice(randomTypeIndex, 1, "spell")[0];
    }
  }
  return settingsArray;
}
// User chooses a card
function cardPick() {
  if (custom) {
    const pickDetails = randomPickSettings();
    filteredPool = pools[pickDetails[0]][pickDetails[1]][pickDetails[2]];
  }
  pickOptions = [];
  const selectedIndices = []; // To log indices and avoid duplicates
  let currentSelection = 0;
  // Build array of options for pick
  for (let i = 0; i < 3; i++) {
    let picksTried = 0;
    do {
      picksTried++;
      if (picksTried > 30) {
        break;
      }
      currentSelection = Math.floor(Math.random() * filteredPool.length);
    } while (selectedIndices.includes(currentSelection) || maxxedAlready(filteredPool[currentSelection])); // Verify index has not already been selected and that two copies of card are not already in deck

    if (picksTried > 30) {
      selectedIndices.push(-1);
      pickOptions.push(blankCard);
    } else {
      selectedIndices.push(currentSelection);
      // Add randomly selected card to pick
      pickOptions.push(filteredPool[currentSelection]);
    }
  }
  renderPick(pickOptions);
  cardDisplay.addEventListener('click', cardPickHandler);
}
// Function that determines if given card is already a 2-of in the deck
function maxxedAlready(proposedCard) {
  let numInDeck = 0;
  for (const card of deck) {
    if (card.cardId === proposedCard.cardId) {
      numInDeck++;
      if (numInDeck === 2 || (card.rarity === "Legendary" && numInDeck === 1)) {
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
    updateProgress();
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
      while (maxxedAlready(newOption)) {
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

  document.getElementById('statMinion').textContent = 0;
  document.getElementById('statSpell').textContent = 0;
  document.getElementById('statWeapon').textContent = 0;

  document.getElementById('statBattlecry').textContent = 0;
  document.getElementById('statDeathrattle').textContent = 0;
  document.getElementById('statTaunt').textContent = 0;

  for (let i = 1; i <= 8; i++) {
      document.getElementById(`cost-bar${i}`).style.height = "0px";
    }

  let hackyNumber = 0;

  array.forEach(function(card) {

    // console.log(array)

    cardName.innerHTML += `
      <div id="cards${hackyNumber < 10 ? ('0' + hackyNumber) : hackyNumber}" class="flex name-style">
        ${card.name}
      </div>
    `;
    hackyNumber++

    cardCost.innerHTML += `
      <div class="flex cost-style">
        ${card.cost}
      </div>
    `;

    //Update Mana Curve
    const element = document.getElementById(`stat${card.type}`);
    element.textContent = Number(element.textContent) + 1;

    if (card.hasOwnProperty("mechanics")) {
        for (const i in card.mechanics) {
          const mechanic = document.getElementById(`stat${card.mechanics[i].name}`);
          if (card.mechanics[i].name === "Battlecry" || card.mechanics[i].name === "Deathrattle" || card.mechanics[i].name === "Taunt") {
            mechanic.textContent = Number(mechanic.textContent) + 1;
          }
        }
      }


    //Update Mana Curve
    // NEEDS TO BE NUMBER OF CARDS AT THAT COST (NOT SIMPLY CARD.COST)
    if (card.cost > 0) {
      let currentHeight = document.getElementById(`cost-bar${card.cost > 8 ? 8 : card.cost}`).style.height;
      document.getElementById(`cost-bar${card.cost > 8 ? 8 : card.cost}`).style.height = (+currentHeight.slice(0,-2) + 8) + 'px';
    }
  });
}


///////////////////////// COMPLETE DECK /////////////////////////

function deckComplete() {
  // localStorage.setItem('deck', JSON.stringify(deck));
  // localStorage.setItem('heroCard', JSON.stringify(heroCard));
  setTimeout(function(){window.open("./export.html", "_self");}, 2000);

}



///////////////////////// RECENTLY ADDED /////////////////////////


//Display Image on hover

const deckCon = document.getElementById('deck-display');
const hiddenCard = document.getElementById('hidden-card');


deckCon.addEventListener('mouseover', (e) => {
  if (e.target && e.target.id.includes("cards")) {
    // Use id of target to determine which option was selected
    const position = +e.target.id.slice(-2);

    // console.log(deck[position].img)
    hiddenCard.childNodes[1].setAttribute('src', deck[position].img);
    hiddenCard.childNodes[1].classList.remove('hidden-card');
  };
})

deckCon.addEventListener('mouseout', (e) => {
  if (e.target && e.target.id.includes("cards")) {
    // Use id of target to determine which option was selected
    const position = +e.target.id.slice(-2);

    // hiddenCard.childNodes[1].setAttribute('src', deck[position].img);
    hiddenCard.childNodes[1].classList.add('hidden-card');

    // console.log(hiddenCard.childNodes[1])
    // console.log(hiddenCard.childNodes[1].classList)

  };
})

//Update Progress Function
function updateProgress(){
  deckDiv = document.getElementById('deck-div');

  deckDiv.innerHTML = `
    <div class="render-above text-muted flex-end">
      <h4>${deck.length}/30</h4>
    </div>
  `
};

//Render Class Name Function
function renderClassName(){
  classDiv = document.getElementById('class-div');

  classDiv.innerHTML = `
    <div class="render-above text-muted flex-end">
      <h4>Class: ${selectedClass}</h4>
    </div>
  `
};




////////////////////////////////////////////////////////////


//img0.childNodes[1].setAttribute('src', array[0].img);
