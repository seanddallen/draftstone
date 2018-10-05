// const customRules = {
//   'classSetting': "consistent",
//   'classCount': NaN,
//   'raritySetting': "custom",
//   'legendaryCount': 3,
//   'epicCount': 5,
//   'rareCount': 7,
//   'typeSetting': "chaos",
//   'spellCount': NaN,
//   'specifiedClass': "Mage"
// };
// const setArray = ["Basic", "Classic", "Hall of Fame", "Naxxramas", "Goblins vs Gnomes", "Blackrock Mountain", "The Grand Tournament", "The League of Explorers", "Whispers of the Old Gods", "One Night in Karazhan", "Mean Streets of Gadgetzan", "Journey to Un'Goro", "Knights of the Frozen Throne", "Kobolds & Catacombs", "The Witchwood", "The Boomsday Project"]; // Stores sets chosen by user



///////////////////////// GLOBAL VARIABLES /////////////////////////
const masterPool = JSON.parse(localStorage.getItem("masterPool"));
let heroes = JSON.parse(localStorage.getItem("heroes"));
const customRules = JSON.parse(localStorage.getItem("customRules"));

const heroFilterSetting = customRules.heroFilterSetting;
const heroArray = customRules.heroArray;
const setFilterSetting = customRules.setFilterSetting;
const setArray = customRules.setArray;
const costFilterSetting = customRules.costFilterSetting;
const costArray = customRules.costArray;
const classSetting = customRules.classSetting;
const classCount = customRules.classCount;
const raritySetting = customRules.raritySetting;
const legendaryCount = customRules.legendaryCount;
const epicCount = customRules.epicCount;
const rareCount = customRules.rareCount;
const typeSetting = customRules.typeSetting;
const spellCount = customRules.spellCount;

let heroCard = {};
let selectedClass = ''; // User selected class
let filteredPool = masterPool.slice(0); // Pool of only Neutral and class cards matching selected class
const deck = []; // Drafted deck
let pickOptions = []; // The three cards in any one pick
const cardDisplay = document.getElementById('card-display');
let pools = {
  'neutral': {
    'minion': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': [],
      'chaos': []
    },
    'spell': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': [],
      'chaos': []
    },
    'chaos': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': [],
      'chaos': []
    }
  },
  'class': {
    'minion': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': [],
      'chaos': []
    },
    'spell': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': [],
      'chaos': []
    },
    'chaos': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': [],
      'chaos': []
    }
  },
  'chaos': {
    'minion': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': [],
      'chaos': []
    },
    'spell': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': [],
      'chaos': []
    },
    'chaos': {
      'Legendary': [],
      'Epic': [],
      'Rare': [],
      'Common': [],
      'chaos': []
    }
  }
};
const randomClass = [];
const randomType = [];
const randomRarity = [];
const blankCard = {
            "name": "Blank Card",
            "cost": 0,
            "attack": 2,
            "health": 4,
            "playerClass": "Neutral",
            "img": "./blank_card.png",
            "mechanics": [],
            "disable": true
        };
const blankHero = {
            "name": "Blank Hero",
            "cost": 0,
            "attack": 2,
            "health": 4,
            "playerClass": "Neutral",
            "img": "./blank_hero.png",
            "mechanics": [],
            "disable": true
        };


////////////////////////
///////////////////////// GET DATA /////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  if (setArray[0] && setArray[0] !== "All") {
    filterPoolBySet(setArray);
  }


  classPick();
});


function filterPoolBySet(setArray) {
  filteredPool =  filteredPool.filter(card => setArray.includes(card.cardSet));
}

function filterPoolByCost(costArray) {
  filteredPool = filteredPool.filter(card => {
    if (card.cost < 10) {
      if (costArray.includes(card.cost.toString())) {
        return true;
      }
    } else if (costArray[costArray.length - 1] == "10+") {
      return true;
    }
    return false;
  });
}

function setupCustom() {
    // Go through each card in the filteredPool and place it in the appropriate sub-pool
    for (let i = 0, numCards = filteredPool.length; i < numCards; i++) {
      const currentCard = filteredPool[0];
      const cardClass = classSetting === "chaos" ? "chaos" : (currentCard.playerClass === "Neutral" ? 'neutral' : 'class');
      const cardType = typeSetting === "chaos" ? "chaos": (currentCard.type === "Minion" ? 'minion' : 'spell');
      const cardRarity = raritySetting === "chaos" ? "chaos" : (currentCard.rarity === "Free" ? 'Common' : currentCard.rarity);
      pools[cardClass][cardType][cardRarity].push(filteredPool.shift());
    }

    // Fill an array with the appropriate number of "class" and "neutral"
    if (classSetting === "custom") {
      for (let i = 0; i < customRules.classCount; i++) {
        randomClass.push("class");
      }
      while (randomClass.length < 30) {
        randomClass.push("neutral");
      }
    } else if (classSetting === "consistent") {
      for (let i = 0; i < 30; i++) {
        const randomCard = masterPool[Math.floor(Math.random() * masterPool.length)];
        randomClass.push(Math.ceil(Math.random() * 10) > 4  ? 'neutral' : 'class');
      }
    } else {
      for (let i = 0; i < 30; i++) {
        randomClass.push("chaos");
      }
    }


    // Fill an array with the appropriate number of "spell" and "minion"
    if (typeSetting === "custom") {
      for (let i = 0; i < spellCount; i++) {
        randomType.push("spell");
      }
      while (randomType.length < 30) {
        randomType.push("minion");
      }
    } else if (typeSetting === "consistent") {
      for (let i = 0; i < 30; i++) {
        randomType.push(masterPool[Math.floor(Math.random() * masterPool.length)].rarity === "Minion" ? 'minion' : 'spell');
      }
    } else {
      for (let i = 0; i < 30; i++) {
        randomType.push("chaos");
      }
    }




    // Fill an array with the appropriate number of each rarity
    if (raritySetting === "custom") {
      for (let i = 0; i < legendaryCount; i++) {
        randomRarity.push("Legendary");
      }
      for (let i = 0; i < epicCount; i++) {
        randomRarity.push("Epic");
      }
      for (let i = 0; i < rareCount; i++) {
        randomRarity.push("Rare");
      }
      while (randomRarity.length < 30) {
        randomRarity.push("Common");
      }
    } else if (raritySetting === "consistent") {
      for (let i = 0; i < 30; i++) {
        const randomCard = masterPool[Math.floor(Math.random() * masterPool.length)];
        randomRarity.push(randomCard.rarity === "Free" ? 'Common' : randomCard.rarity);
      }
    } else {
      for (let i = 0; i < 30; i++) {
        randomRarity.push("chaos");
      }
    }
}

///////////////////////// PICK CLASS /////////////////////////
function renderPick(array) {
  const img0 = document.getElementById('img0');
  const img1 = document.getElementById('img1');
  const img2 = document.getElementById('img2');
  //append 3 images

  img0.childNodes[1].setAttribute('src', array[0].img);
  img1.childNodes[1].setAttribute('src', array[1].img);
  img2.childNodes[1].setAttribute('src', array[2].img);
  img0.childNodes[1].setAttribute('id', 'img0');
  img1.childNodes[1].setAttribute('id', 'img1');
  img2.childNodes[1].setAttribute('id', 'img2');

  // img0.innerHTML = `<img id="img0" class="responsive" src="${array[0].img}" alt="">`;
  // img1.innerHTML = `<img id="img1" class="responsive" src="${array[1].img}" alt="">`;
  // img2.innerHTML = `<img id="img2" class="responsive" src="${array[2].img}" alt="">`;
}
// User chooses class
function classPick() {
  pickOptions = [];

  if (heroFilterSetting === "custom") {
    // for (const hero of heroes) {
    //   if (hero.playerClass === specifiedClass) {
    //     for (let i = 0; i < 3; i++) {
    //       pickOptions.push(hero);
    //     }
    //     break;
    //   }
    // }
    heroes = heroes.filter(hero => {
      for (const specifiedClass of heroArray) {
          if (hero.playerClass === specifiedClass) {
            return true;
          }
      }
      return false;
    });
  }


  const selectedIndices = []; // To log indices and avoid duplicates
  let currentSelection = 0;
 // Build array of options for pick
  for (let i = 0; i < Math.min(3, heroes.length); i++) {
    do {
      currentSelection = Math.floor(Math.random() * heroes.length);
    } while (selectedIndices.includes(currentSelection)); // Verify index has not already been selected
    selectedIndices.push(currentSelection);
    // Add randomly selected hero to pick
    pickOptions.push(heroes[currentSelection]);
  }
  for (let i = 0; i < 3 - heroes.length; i++) {
    pickOptions.push(blankHero);
  }



  hide = document.getElementById('hide');
  hide.classList.remove('hidden');
  renderPick(pickOptions);
  cardDisplay.addEventListener('click', classPickHandler);
}

function classPickHandler(e) {
  // Ensure target is a card image
  if (e.target && e.target.id.includes("img") && !pickOptions[+e.target.id.slice(-1)].disable) {
    // Remove event listener so it only triggers once
    cardDisplay.removeEventListener('click', classPickHandler);
    // Use id of target to determine which option was selected
    const position = +e.target.id.slice(-1);
    selectedClass = pickOptions[position].playerClass;
    heroCard = pickOptions[position];
    // Filter the master pool down to exclude all class cards that are not of chosen class
    filteredPool = filteredPool.filter(card => card.playerClass === "Neutral" || card.playerClass === selectedClass);



    if (costArray[0] && costArray[0] !== "All") {
      filterPoolByCost(costArray);
    }


    setupCustom();

    renderClassName();
    // Move flow of program to card picking stage
    cardPick();
  }
}
///////////////////////// PICK DECK /////////////////////////

// For a single pick, randomly decide the parameters of that pick based on the remaining possibilities (uses the "random" arrays).
function randomPickSettings() {
  const settingsArray = [];
  settingsArray.push(randomClass.splice(Math.floor(Math.random() * randomClass.length), 1)[0]);
  settingsArray.push(randomType.splice(Math.floor(Math.random() * randomType.length), 1)[0]);
  settingsArray.push(randomRarity.splice(Math.floor(Math.random() * randomRarity.length), 1)[0]);

  // Ensure that neutral and spell aren't parameters at the same time
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
  if (classSetting !== "chaos" || raritySetting !== "chaos" || typeSetting !== "chaos") {
    const pickDetails = randomPickSettings();
    filteredPool = pools[pickDetails[0]][pickDetails[1]][pickDetails[2]];
  } else {
    filteredPool = pools.chaos.chaos.chaos;
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
  if (e.target && e.target.id.includes("img") && !pickOptions[+e.target.id.slice(-1)].disable) {
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
  document.getElementById('statDiscover').textContent = 0;

  document.getElementById('statTaunt').textContent = 0;
  document.getElementById('statCharge').textContent = 0;
  document.getElementById('statSecret').textContent = 0;

  for (let i = 1; i <= 8; i++) {
      document.getElementById(`cost-bar${i}`).style.height = "0px";
    }

  let hackyNumber = 0;

  array.forEach(function(card) {

    // console.log(array)

    // cardName.innerHTML += `
    //   <div id="cards${hackyNumber < 10 ? ('0' + hackyNumber) : hackyNumber}" class="flex name-style">
    //     ${card.name}
    //   </div>
    // `;

    cardName.innerHTML += `
      <div id="cards${hackyNumber < 10 ? ('0' + hackyNumber) : hackyNumber}" class="flex name-style">
        <div id="cards" class="deck-pick" style="width:100%; height:24px;">
          <div class="flex">
            <div id="cardsname" style="width:60%;">
              ${card.name}
            </div>
              <!--<img src="${card.img}" style="height:24px; width:40%; clip-path: inset(-45px -120px);">-->
            <div id="cardsimg" style="background: url('${card.img}'); background-position: -62px -110px; height:30px; width:55%; background-repeat: no-repeat; zoom:80%; float:right; z-index:1;">
              <div style="z-index:99; background: linear-gradient(to right, rgb(221,216,204) 6%, rgba(255, 255, 255, 0) 30%), linear-gradient(to left, rgb(221,216,204) -1%, rgba(255, 255, 255, 0) 30%), linear-gradient(to top, rgb(221,216,204) 0%, rgba(255, 255, 255, 0) 20%), linear-gradient(to bottom, rgb(221,216,204) 0%, rgba(255, 255, 255, 0) 20%); height: 30px;">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    hackyNumber++;

    cardCost.innerHTML += `
      <div class="flex cost-style" style="height:24px; font-weight: bold; text-shadow: -1px 0px rgb(0, 0, 0), 0px 1px rgb(0, 0, 0), 1px 0px rgb(0, 0, 0), 0px -1px rgb(0, 0, 0);">
        ${card.cost}
      </div>
    `;

    //Update Mana Curve
    const element = document.getElementById(`stat${card.type}`);
    element.textContent = Number(element.textContent) + 1;

    if (card.hasOwnProperty("mechanics")) {
      for (const i in card.mechanics) {
        const mechanic = document.getElementById(`stat${card.mechanics[i].name}`);
        if (card.mechanics[i].name === "Battlecry" || card.mechanics[i].name === "Deathrattle" || card.mechanics[i].name === "Taunt" || card.mechanics[i].name === "Discover" || card.mechanics[i].name === "Secret" || card.mechanics[i].name === "Charge") {
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
  localStorage.setItem('deck', JSON.stringify(deck));
  localStorage.setItem('heroCard', JSON.stringify(heroCard));
  setTimeout(function(){window.open("./export.html", "_self");}, 2000);

}



///////////////////////// RECENTLY ADDED /////////////////////////


//Display Image on hover

const deckCon = document.getElementById('deck-display');
const pickDisplay = document.getElementById('card-display');
const hiddenCard = document.getElementById('hidden-card');
const pick1 = document.getElementById('img0');
const pick2 = document.getElementById('img1');
const pick3 = document.getElementById('img2');
const xbtn01 = document.getElementById('xbtn1');
const xbtn02 = document.getElementById('xbtn2');
const xbtn03 = document.getElementById('xbtn3');


deckCon.addEventListener('mouseover', (e) => {
  if (e.target && e.target.id.includes("cards")) {
    // Use id of target to determine which option was selected
    const position = +e.target.id.slice(-2);

    // console.log(deck[position].img)
    pick1.classList.toggle('faded');
    pick2.classList.toggle('faded');
    pick3.classList.toggle('faded');
    xbtn01.classList.toggle('faded');
    xbtn02.classList.toggle('faded');
    xbtn03.classList.toggle('faded');

    // hiddenCard.childNodes[1].classList.remove('faded');
    hiddenCard.childNodes[1].setAttribute('src', deck[position].img);
    // hiddenCard.childNodes[1].setAttribute('style', 'opacity:1.0 !important;');
    hiddenCard.childNodes[1].classList.remove('hidden-card');

  }
});

deckCon.addEventListener('mouseout', (e) => {
  if (e.target && e.target.id.includes("cards")) {
    // Use id of target to determine which option was selected
    const position = +e.target.id.slice(-2);

    // hiddenCard.childNodes[1].setAttribute('src', deck[position].img);
    pick1.classList.toggle('faded');
    pick2.classList.toggle('faded');
    pick3.classList.toggle('faded');
    xbtn01.classList.toggle('faded');
    xbtn02.classList.toggle('faded');
    xbtn03.classList.toggle('faded');
    hiddenCard.childNodes[1].classList.add('hidden-card');

    // console.log(hiddenCard.childNodes[1])
    // console.log(hiddenCard.childNodes[1].classList)

  }
});

//Update Progress Function
function updateProgress(){
  deckDiv = document.getElementById('deck-div');

  deckDiv.innerHTML = `
    <div class="render-above text-muted flex-end">
      <h4>${deck.length}/30</h4>
    </div>
  `;
}

//Render Class Name Function
function renderClassName(){
  classDiv = document.getElementById('class-div');

  classDiv.innerHTML = `
    <div class="render-above text-muted flex-end">
      <h4>Class: ${selectedClass}</h4>
    </div>
  `;
}




////////////////////////////////////////////////////////////


// img0.childNodes[1].setAttribute('src', array[0].img);
