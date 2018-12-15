//Grab data from local storage
const customRules = JSON.parse(localStorage.getItem("customRules"));
// customRules = JSON.parse(`{"filterType":"absolute","heroFilterSetting":"all","heroArray":[],"setFilterSetting":"all","setArray":[],"costFilterSetting":"all","costArray":[],"classSetting":"consistent","classCount":null,"raritySetting":"consistent","legendaryCount":null,"epicCount":null,"rareCount":null,"typeSetting":"consistent","spellCount":null,"special":"Sprinkles"}`)
// console.log(JSON.parse(JSON.stringify(customRules)))

const masterPool = JSON.parse(localStorage.getItem("masterPool"));
let heroes = JSON.parse(localStorage.getItem("heroes"));

//saved in the ejs
userCollection = JSON.parse(userCollection.split("&#34;").join('"').split("&#39;").join("'"))

if(customRules.filterType === "relative") {
  for (let count in customRules) {
    if (count.includes("Count")) {
      if (+customRules[count] === 100) {
        customRules[count] = "99.99"
      }
      if (+customRules[count] === 0) {
        customRules[count] = "0.01"
      }
    }
  }
}


let {
  filterType,
  heroFilterSetting,
  heroArray,
  setFilterSetting,
  setArray,
  costFilterSetting,
  costArray,
  classSetting,
  classCount,
  raritySetting,
  legendaryCount,
  epicCount,
  rareCount,
  typeSetting,
  spellCount,
  special } = customRules;


//Filter cards based on user collection (also adds quantity property to card)
const userPool = masterPool.filter(card => {
  if (userCollection[card.name]) {
    card.quantity = userCollection[card.name]
    return true
  }
  return false
})

for (let card of userPool) {
  card.img = `https://art.hearthstonejson.com/v1/render/latest/enUS/256x/${card.cardId}.png`
}

//code taken from statck overflow for normal dist
function randn_bm() {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
  return num;
}

if (filterType === "relative") {
  if (classSetting === "chaos") {
    classCount = 40;
  }
  if (raritySetting === "chaos") {
    legendaryCount = 8.6;
    epicCount = 16.5
    rareCount = 27.7
  }
  if (typeSetting === "chaos") {
    spellCount = 31
  }
} else {
  if (special === "Sprinkles") {
    classCount = Math.round(randn_bm() * 3) + 12
    legendaryCount = 25
    epicCount = 1
    rareCount = 2
    spellCount = 5
  } else {
    if (classSetting !== "custom") {
      classCount = Math.round(randn_bm() * 3) + 12
    }
    if (raritySetting !== "custom") {
      legendaryCount = Math.max(Math.round(randn_bm() * 1) + 2, 0)
      epicCount = Math.max(Math.round(randn_bm() * 2) + 5, 0)
      rareCount = Math.min(Math.max(Math.round(randn_bm() * 2.5) + 10, 0),30 - legendaryCount - rareCount)
    }
    if (typeSetting !== "custom") {
      spellCount = Math.max(Math.round(randn_bm() * 3) + 10, 0, classCount)
    }
  }
}



let commonCount = (filterType === "relative" ? 100 : 30) - (Number(legendaryCount) + Number(epicCount) + Number(rareCount))
let minionCount = (filterType === "relative" ? 100 : 30) - spellCount
let neutralCount = (filterType === "relative" ? 100 : 30) - classCount



const pObj = {
  LSC: legendaryCount / 100 * spellCount / 100,
  LMN: legendaryCount / 100 * minionCount / 100 * neutralCount / 100,
  LMC: legendaryCount / 100 * minionCount / 100 * classCount / 100,
  ESC: epicCount / 100 * spellCount / 100,
  EMN: epicCount / 100 * minionCount / 100 * neutralCount / 100,
  EMC: epicCount / 100 * minionCount / 100 * classCount / 100,
  RSC: rareCount / 100 * spellCount / 100,
  RMN: rareCount / 100 * minionCount / 100 * neutralCount / 100,
  RMC: rareCount / 100 * minionCount / 100 * classCount / 100,
  CSC: commonCount / 100 * spellCount / 100,
  CMN: commonCount / 100 * minionCount / 100 * neutralCount / 100,
  CMC: commonCount / 100 * minionCount / 100 * classCount / 100
}


const pObjCum = {}

// function totalP() {
//   let total = 0
//   for (const category in pObj) {
//     total += pObj[category]
//   }
//   return total
// }

function buildPObjCum() {
  let cumulativeP = 0
  for (const category in pObj) {
    cumulativeP += pObj[category]
    if (pObj[category] <= 0 && pObjCum.hasOwnProperty(category)) {
      delete pObjCum[category]
    } else {
      pObjCum[category] = cumulativeP
    }
  }
}

buildPObjCum()

function redistribute(emptyCategory) {
  const upForGrabs = pObj[emptyCategory]
  for (const category in pObj) {
    if(pObj[category] > 0) {
      pObj[category] /= 1 - upForGrabs
    }
  }
  pObj[emptyCategory] = 0
  buildPObjCum()
}

function randomCategory() {
  let randomNumber = Math.random()
  for (const category in pObjCum) {
    if (randomNumber < pObjCum[category]) {
      return category
    }
  }
}

// function testAwesomeness() {
//  const frequency = {}
//  const empiricalP = {}
//  for (const category in pObj) {
//    frequency[category] = 0;
//  }
//  for (let i = 0; i < 100000; i++) {
//    frequency[randomCategory()]++;
//  }
//  for (const category in pObj) {
//   empiricalP[category] = frequency[category] / 100000
//  }
//  return empiricalP;
// }

let heroCard = {};
let selectedClass = ''; // User selected class
let filteredPool = masterPool.slice(0); // Pool of only Neutral and class cards matching selected class
const deck = []; // Drafted deck
let pickOptions = []; // The three cards in any one pick
const cardDisplay = document.getElementById('card-display');

const blankCard = {
            "name": "Blank Card",
            "cost": 0,
            "attack": 2,
            "health": 4,
            "playerClass": "Neutral",
            "img": "/images/blank_card.png",
            "mechanics": [],
            "disable": true
        };
const blankHero = {
            "name": "Blank Hero",
            "cost": 0,
            "attack": 2,
            "health": 4,
            "playerClass": "Neutral",
            "img": "/images/blank_hero.png",
            "mechanics": [],
            "disable": true
        };

class collection {
  constructor(arrayOfCards) {
    this.cards = arrayOfCards.map(card => ({
      ...card
    }))
    this.sorted = {
      LSC: [],
      LMN: [],
      LMC: [],
      ESC: [],
      EMN: [],
      EMC: [],
      RSC: [],
      RMN: [],
      RMC: [],
      CSC: [],
      CMN: [],
      CMC: [],
    }

    this.count = {
      Legendary: 0,
      Epic: 0,
      Rare: 0,
      Common: 0,
      Spell: 0,
      Minion: 0,
      Class: 0,
      Neutral: 0,
    }
  }

  cardsLeft(...categories) {
    if(!categories[0]) {
      categories = Object.keys(this.sorted)
    }
    let total = 0;
    for (const category of categories) {
      for (const card of this.sorted[category]) {
        total += card.quantity
      }
    }
    return total
  }

  //filters THIS collection
  filterClassSetCost(heroArray, setArray, costArray) {
    heroArray.push("Neutral")
    this.cards = this.cards.filter(card =>
      ( !heroArray[1] || heroArray.includes(card.playerClass) ) &&
      ( !setArray[0] || setArray.includes(card.cardSet) ) &&
      ( !costArray[0] || costArray.includes(card.cost + "") ||
        (costArray.includes("10+") && card.cost > 9) )
    )
  }

  filterSpecial(special) {
    if (special === "Battlecry") {
      this.cards = this.cards.filter(card => card.text && (card.text.includes("Battlecry") || card.text.includes("Battlecries")))
    } else if (special === "Deathrattle") {
      this.cards = this.cards.filter(card => card.text && (card.text.includes("Deathrattle") || card.text.includes("Deathrattles")))
    }

  }

  //filters based on chosen class
  filterByClass(selectedClass) {
    this.cards = this.cards.filter(card => (card.playerClass === "Neutral" && (!card.classes || card.classes.includes(selectedClass))) || card.playerClass === selectedClass)
  }

  sortIntoCategories() {
    for (const card of this.cards) {
      let category = ''
      if (card.rarity === "Free") {
        category += "C"
        this.count.Common += card.quantity
      } else {
        category += card.rarity[0]
        this.count[card.rarity] += card.quantity
      }

      if (card.type === "Minion") {
        category += "M"
        this.count.Minion += card.quantity
      } else {
        category += "S"
        this.count.Spell += card.quantity
      }

      if (card.playerClass === "Neutral") {
        category += "N"
        this.count.Neutral += card.quantity
      } else {
        category += "C"
        this.count.Class += card.quantity
      }

      card.category = category
      this.sorted[category].push(card)
    }
  }
  

  removeCard(selectedCard, amountToRemove) {
    selectedCard.quantity -= amountToRemove
    if (selectedCard.quantity < 1) {
      this.sorted[selectedCard.category] = this.sorted[selectedCard.category].filter(card => card.dbfId !== selectedCard.dbfId)
    }
  }
}

const masterCollection = new collection(masterPool)
const filteredCollection = new collection(userPool)
filteredCollection.filterClassSetCost(heroArray, setArray, costArray)
console.log(special)
// if (special === "Battlecry" || special === "Deathrattle") {
//   filteredCollection.filterSpecial(special)
// }

if (filteredCollection.cards.length < 30) {
  invalidDraft();
}

function invalidDraft() {
  window.alert('Completing this draft will be impossible. Your collection is too small and/or your settings are too specific.')
}


////////////////////////
///////////////////////// GET DATA /////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  classPick();
});

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
}

// User chooses class
function classPick() {
  pickOptions = [];

  if (userCollectionId === 1) {
    xbtn01.classList.toggle('hidden');
    xbtn02.classList.toggle('hidden');
    xbtn03.classList.toggle('hidden');
  }

  if (heroFilterSetting === "custom") {
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

    filteredCollection.filterByClass(selectedClass)

    filteredCollection.sortIntoCategories()
    for (const category in filteredCollection.sorted) {
      if (!filteredCollection.sorted[category].length) {
        redistribute(category)
      }
    }

    if (filterType === "absolute") {
      if ( filteredCollection.count.legendary < legendaryCount ||
          filteredCollection.count.epic < epicCount ||
          filteredCollection.count.rare < rareCount ||
          filteredCollection.count.common < (30 - (legendaryCount + epicCount + rareCount ) ) ||
          filteredCollection.count.spell < spellCount ||
          filteredCollection.count.minion < (30 - spellCount) ||
          filteredCollection.count.class < classCount ||
          filteredCollection.count.neutral < (30 - classCount)
        ) {
          
          invalidDraft()
        }
    }


    renderClassName();
    // Move flow of program to card picking stage

    if (userCollectionId === 1) {
      xbtn01.classList.toggle('hidden');
      xbtn02.classList.toggle('hidden');
      xbtn03.classList.toggle('hidden');
    }

    if (filterType === "absolute") {
      setupAbsolute()
    }


    cardPick();
  }
}

let picTypes = []

function setupAbsolute() {

  if (filterType === "absolute") {
    if(typeSetting !== "custom") {
      spellCount = Math.min(filteredCollection.cardsLeft('LSC', 'ESC', 'RSC', 'CSC'), spellCount)
      minionCount = 30 - spellCount
    }
    if(raritySetting !== "custom") {
      legendaryCount = Math.min(filteredCollection.cardsLeft('LSC', 'LMC', 'LMN'), legendaryCount)
      epicCount = Math.min(filteredCollection.cardsLeft('LSC', 'LMC', 'LMN'), epicCount)
      rareCount = Math.min(filteredCollection.cardsLeft('LSC', 'LMC', 'LMN'), rareCount)
      commonCount = 30 - legendaryCount - epicCount - rareCount
    }
    if(classSetting !== "custom") {
      classCount = Math.min(filteredCollection.cardsLeft('LSC', 'LMC', 'ESC', 'EMC', 'RSC', 'RMC', 'CSC', 'CMC'), classCount)
      neutralCount = 30 - classCount
    }


    const SC = spellCount
    const MC = classCount - spellCount
    const MN = minionCount - MC
    if (filteredCollection.cardsLeft('LSC', 'ESC', 'RSC', 'CSC') < SC ||
    filteredCollection.cardsLeft('LMC', 'EMC', 'RMC', 'CMC') < MC ||
    filteredCollection.cardsLeft('LMN', 'EMN', 'RMN', 'CMN') < MN) {
      invalidDraft()
    }
    const combinations = []

    const maxLSC = Math.min(SC, legendaryCount, filteredCollection.cardsLeft('LSC'))
    const maxRSC = Math.min(rareCount, filteredCollection.cardsLeft('RSC'))
    const maxESC = Math.min(epicCount, filteredCollection.cardsLeft('ESC'))
    const maxCSC = Math.min(commonCount, filteredCollection.cardsLeft('CSC'))

    const maxLMC = Math.min(MC, legendaryCount, filteredCollection.cardsLeft('LMC'))
    const maxEMC = Math.min(epicCount, filteredCollection.cardsLeft('EMC'))
    const maxRMC = Math.min(rareCount, filteredCollection.cardsLeft('RMC'))
    const maxCMC = Math.min(commonCount, filteredCollection.cardsLeft('CMC'))

    const maxLMN = Math.min(MN, legendaryCount, filteredCollection.cardsLeft('LMN'))
    const maxEMN = Math.min(epicCount, filteredCollection.cardsLeft('EMN'))
    const maxRMN = Math.min(rareCount, filteredCollection.cardsLeft('RMN'))
    const maxCMN = Math.min(commonCount, filteredCollection.cardsLeft('CMN'))


    for(let LSC = 0; LSC <= maxLSC; LSC++) {
      for(let ESC = 0; ESC <= Math.min(SC - LSC, maxESC); ESC++) {
        for (let RSC = 0; RSC <= Math.min(SC - LSC - ESC, maxRSC); RSC++) {
          let CSC = SC - LSC - ESC - RSC
          if (CSC <= maxCSC) {
            for (let LMC = 0; LMC <= Math.min(legendaryCount - LSC,maxLMC); LMC++) {
              let LMN = legendaryCount - LSC - LMC
              if (LMN <= maxLMN) {
                for (let EMC = 0; EMC <= Math.min(MC - LMC, epicCount - ESC, maxEMC); EMC++) {
                  let EMN = epicCount - ESC - EMC
                  if(EMN <= maxEMN) {
                    for (let RMC = 0; RMC <= Math.min(MC - LMC - EMC, rareCount - RSC, maxRMC); RMC++) {
                      let RMN = rareCount - RSC - RMC
                      if (RMN <= maxRMN) {
                        let CMC = MC - LMC - EMC - RMC
                        if (CMC <= maxCMC) {
                          let CMN = MN - LMN - EMN - RMN
                          if (CMN === commonCount - CSC - CMC && CMN <= maxCMN) {
                            if (special === "Sprinkles") {
                              if (LSC + LMC + LMN === 25 && ESC + RSC + CSC === 5) {
                                combinations.push({LSC, LMN, LMC, ESC, EMN, EMC, RSC, RMN, RMC, CSC, CMN, CMC})
                              }
                            } else {
                              combinations.push({LSC, LMN, LMC, ESC, EMN, EMC, RSC, RMN, RMC, CSC, CMN, CMC})
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log(combinations)

    const chosenCombination = combinations[Math.floor(Math.random() * combinations.length)]
    for (const category in chosenCombination) {
      for (let i = 0; i < chosenCombination[category]; i++) {
        picTypes.push(category)
      }
    }
  }
}

///////////////////////// PICK DECK /////////////////////////

// User chooses a card
function cardPick() {
  pickOptions = []
  let category = ""
  if (filterType === "absolute") {
    category = picTypes.splice(Math.floor(Math.random() * picTypes.length), 1)[0]
  }
  for (let i = 0; i < 3; i++) {
    let duped = true
    let randomCard = {}
    while (duped) {
      duped = false
      if (filterType === "relative") {
        category = randomCategory()
      } else if ([classSetting, raritySetting, typeSetting].includes("chaos")) {
        if (deck.length < 29) {
          let individualCategory = ""
          individualCategory += raritySetting === "chaos" ? picTypes[Math.floor(Math.random() * picTypes.length)][0] : category[0]
          individualCategory += typeSetting === "chaos" ? picTypes[Math.floor(Math.random() * picTypes.length)][1] : category[1]
          individualCategory += individualCategory[1] === "S" ? "C" : (classSetting === "chaos" ? picTypes[Math.floor(Math.random() * picTypes.length)][2] : category[2])
          category = filteredCollection.sorted[individualCategory].length ? individualCategory : category
        }
      }
      const randomIndex = Math.floor(Math.random() * filteredCollection.sorted[category].length)
      randomCard = filteredCollection.sorted[category][randomIndex]
      if ((filteredCollection.cardsLeft() > 3) && (pickOptions[0] && pickOptions[0].dbfId === randomCard.dbfId) || (pickOptions[1] && pickOptions[1].dbfId === randomCard.dbfId)) {
        duped = true
      }
    }
    pickOptions.push(randomCard)
  }

  renderPick(pickOptions);
  cardDisplay.addEventListener('click', cardPickHandler);
}

function cardPickHandler(e) {
  // Ensure target is a card image
  if (e.target && e.target.id.includes("img") && !pickOptions[+e.target.id.slice(-1)].disable) {
    // Remove event listener to avoid multiple triggers
    cardDisplay.removeEventListener('click', cardPickHandler);
    // Use id of target to determine which option was selected
    const position = +e.target.id.slice(-1);
    // Add choosen card to deck
    const selectedCard = pickOptions[position]
    deck.push(selectedCard);
    filteredCollection.removeCard(selectedCard, 1)

    if (filteredCollection.sorted[selectedCard.category].length === 0) {
      redistribute(selectedCard.category)
    }
    updateProgress();
    sortDeck();
    renderDeck(deck);
    // Restart card pick process until 30 picks are made
    if (deck.length < 30) {
      cardPick();
    } else {
      deckComplete();
    }
  }

  // If user clicks red x indicating they don't own the card
    if (e.target && e.target.id.includes("xbtn")) {

      // Removed unowned card and replace with new random card
      let pickIndex = +e.target.id.slice(-1) - 1

      filteredCollection.removeCard(pickOptions[pickIndex], 2)

      if (30 - deck.length  > filteredCollection.cardsLeft()) {
        window.alert("There are not enough cards left based on your settings and collection in order to complete this draft. We recommend going back and choosing new settings.")
      }

      const categoryOfRemoved = pickOptions[pickIndex].category

      if(!filteredCollection.sorted[categoryOfRemoved].length) {
        redistribute(categoryOfRemoved)
      }

      let duped = true
      let newOption = {}
      while (duped) {
        duped = false
        if (filterType === "relative") {
          category = randomCategory()
        } else {
          category = pickOptions[pickIndex].category
        }
        const randomIndex = Math.floor(Math.random() * filteredCollection.sorted[category].length)
        newOption = filteredCollection.sorted[category][randomIndex]
        if ((filteredCollection.cardsLeft() > 3) && (pickOptions[0] && pickOptions[0].dbfId === newOption.dbfId) || (pickOptions[1] && pickOptions[1].dbfId === newOption.dbfId) | (pickOptions[2] && pickOptions[2].dbfId === newOption.dbfId)) {
          duped = true
        }
      }
      pickOptions.splice(pickIndex, 1, newOption)

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
            <div id="cardsimg" style="background: url('${card.img}'); background-position: -32px -80px; height:30px; width:55%; background-repeat: no-repeat; zoom:80%; float:right; z-index:1;">
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
    if (card.cost > 0) {
      let currentHeight = document.getElementById(`cost-bar${card.cost > 8 ? 8 : card.cost}`).style.height;
      document.getElementById(`cost-bar${card.cost > 8 ? 8 : card.cost}`).style.height = (+currentHeight.slice(0,-2) + 8) + 'px';
    }
  });
}

///////////////////////// COMPLETE DECK /////////////////////////
function deckComplete() {
  axios.post('/draftcount').then(()=>{
    localStorage.setItem('deck', JSON.stringify(deck));
    localStorage.setItem('heroCard', JSON.stringify(heroCard));
    setTimeout(function(){window.open("/export", "_self");}, 2000);
  })
}

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
    const position = +e.target.parentNode.parentNode.parentNode.id.slice(-2);

    pick1.classList.toggle('faded');
    pick2.classList.toggle('faded');
    pick3.classList.toggle('faded');

    if(xbtn01) {
      xbtn01.classList.toggle('faded');
      xbtn02.classList.toggle('faded');
      xbtn03.classList.toggle('faded');
    }

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
    if (xbtn01) {
      xbtn01.classList.toggle('faded');
      xbtn02.classList.toggle('faded');
      xbtn03.classList.toggle('faded');
    }
    hiddenCard.childNodes[1].classList.add('hidden-card');


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
