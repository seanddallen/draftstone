localStorage.clear();
const masterPool = []; // All collectible cards
const heroes = []; // The nine original heroes to represent classes


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

   // Save both arrays to local storage in order to be accessed by draft page
   // eventually this will be placed in the server and the API call won't be necessary at all
   localStorage.setItem("masterPool", JSON.stringify(masterPool));
   localStorage.setItem("heroes", JSON.stringify(heroes));

   // The "Start Draft" button is faded (low opacity) at first, but becomes fully "active" once the data from the API is processed
   // this too will probably become unnecessary once we have our own server
   const draftBtn =  document.getElementById('draft-btn');
   draftBtn.classList.remove("inactive");

   // Once the user is ready to draft (either they have chosen settings or foregone doing so), they will click this button
   // The button triggers storing of all their settings to localStorage in order to be retrieved during the draft
   draftBtn.addEventListener('click', e => {

     //if()

     const heroArray = [];
     let heroOptions = document.getElementById('select-hero').options;
     for (const set of setOptions)




     // Retrieve and store sets chosen by user
     const setArray = [];
     let setOptions = document.getElementById('select-set').options;
     for (const set of setOptions) {
       if(set.selected) {
         setArray.push(set.value);
       }
     }
     localStorage.setItem("chosenSets", JSON.stringify(setArray));

     const costArray = [];
     let costOptions = document.getElementById('select-cost').options;
     for (const cost of costOptions) {
       if (cost.selected) {
         costArray.push(cost.value);
       }
     }
     localStorage.setItem("chosenCosts", JSON.stringify(costArray));

     localStorage.setItem("custom", true);


     // Read, build object and store custom rules
     let customRules = {};

     //TODO change these once you can access radio buttons
     const classSetting = "consistent";
     const raritySetting = "custom";
     const typeSetting = "chaos";

     let classCount = classSetting !== "custom" ? NaN : document.getElementById('classInput').value;

     let legendaryCount = raritySetting !== "custom" ? NaN : document.getElementById('legendInput').value;
     let epicCount = raritySetting !== "custom" ? NaN : document.getElementById('epicInput').value;
     let rareCount = raritySetting !== "custom" ? NaN : document.getElementById('rareInput').value;

     let spellCount = typeSetting !== "custom" ? NaN : document.getElementById('spellInput').value;

     let specifiedClass = document.getElementById('select-hero').value;



     customRules = {
       'classSetting': classSetting,
       'classCount': classCount,
       'raritySetting': raritySetting,
       'legendaryCount': legendaryCount,
       'epicCount': epicCount,
       'rareCount': rareCount,
       'typeSetting': typeSetting,
       'spellCount': spellCount,
       'specifiedClass': specifiedClass
     };


     localStorage.setItem("customRules", JSON.stringify(customRules));

     //window.location.href = "draft.html";


   });
 });
});

//Multi-Select Click Function
window.onmousedown = function (e) {
    var el = e.target;
    if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
        e.preventDefault();

        // toggle selection
        if (el.hasAttribute('selected')) el.removeAttribute('selected');
        else el.setAttribute('selected', '');

        // hack to correct buggy behavior
        var select = el.parentNode.cloneNode(true);
        el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
};

// Enable/Disable Hero Checkbox/Multiselect
let selectHero = document.getElementById("select-hero");
const heroAllInput = document.getElementById("hero-all-input");
const heroCustomInput = document.getElementById("hero-custom-input");


heroCustomInput.addEventListener('change', () => {
  selectHero = document.getElementById("select-hero");
  if (heroCustomInput.checked === true){
    selectHero.classList.toggle('faded');
    selectHero.childNodes.forEach((node)=>{
      node.disabled = false;
    })
    console.log(selectHero.classList)
  } else {
    selectHero.childNodes.disabled = true;
  }
});

heroAllInput.addEventListener('change', () => {
  selectHero = document.getElementById("select-hero");
  if (heroAllInput.checked === true){
    selectHero.classList.toggle('faded');
    selectHero.childNodes.forEach((node)=>{
      node.disabled = true;
      node.selected = false;
    })
    console.log(selectHero.classList);
  }
});

// Enable/Disable Set Checkbox/Multiselect
let selectSet = document.getElementById("select-set");
const setAllInput = document.getElementById("set-all-input");
const setCustomInput = document.getElementById("set-custom-input");


setCustomInput.addEventListener('change', () => {
  selectSet = document.getElementById("select-set")
  if (setCustomInput.checked === true){
    selectSet.classList.toggle('faded');
    selectSet.childNodes.forEach((node)=>{
      node.disabled = false;
    })
  } else {
    selectSet.childNodes.disabled = true;
  }
});

setAllInput.addEventListener('change', () => {
  selectSet = document.getElementById("select-set");
  if (setAllInput.checked === true){
    selectSet.classList.toggle('faded');
    selectSet.childNodes.forEach((node)=>{
      node.disabled = true;
      node.selected = false;
    })
  }
});

// Enable/Disable Cost Checkbox/Multiselect
let selectCost = document.getElementById("select-cost");
const costAllInput = document.getElementById("cost-all-input");
const costCustomInput = document.getElementById("cost-custom-input");


costCustomInput.addEventListener('change', () => {
  selectCost = document.getElementById("select-cost")
  if (costCustomInput.checked === true){
    selectCost.classList.toggle('faded');
    selectCost.childNodes.forEach((node)=>{
      node.disabled = false;
    })
  } else {
    selectCost.childNodes.disabled = true;
  }
});

costAllInput.addEventListener('change', () => {
  selectCost = document.getElementById("select-cost");
  if (costAllInput.checked === true){
    selectCost.classList.toggle('faded');
    selectCost.childNodes.forEach((node)=>{
      node.disabled = true;
      node.selected = false;
    })
  }
});



// Enable/Disable Type Checkbox/Slider
const typeFieldSet = document.getElementById("type-fieldset");
const typeCustomInput = document.getElementById("type-custom-input");
const typeChaosInput = document.getElementById("type-chaos-input");
const typeConsistentInput = document.getElementById("type-consistent-input");


typeCustomInput.addEventListener('change', () => {
  if (typeCustomInput.checked === true){
    typeFieldSet.disabled = false;
  } else {
    typeFieldSet.disabled = true;
  }
});

typeChaosInput.addEventListener('change', () => {
  if (typeChaosInput.checked === true){
    typeFieldSet.disabled = true;
    minionInput.value = 0;
    spellInput.value = 0;
    minionOutput.value = 0;
    spellOutput.value = 0;
  }
});

typeConsistentInput.addEventListener('change', () => {
  if (typeConsistentInput.checked === true){
    typeFieldSet.disabled = true;
    minionInput.value = 0;
    spellInput.value = 0;
    minionOutput.value = 0;
    spellOutput.value = 0;
  }
});

// Enable/Disable Class Checkbox/Slider
const classFieldSet = document.getElementById("class-fieldset");
const classCustomInput = document.getElementById("class-custom-input");
const classChaosInput = document.getElementById("class-chaos-input");
const classConsistentInput = document.getElementById("class-consistent-input");


classCustomInput.addEventListener('change', () => {
  if (classCustomInput.checked === true){
    classFieldSet.disabled = false;
  } else {
    classFieldSet.disabled = true;
  }
});

classChaosInput.addEventListener('change', () => {
  if (classChaosInput.checked === true){
    classFieldSet.disabled = true;
    classInput.value = 0;
    neutralInput.value = 0;
    classOutput.value = 0;
    neutralOutput.value = 0;
  }
});

classConsistentInput.addEventListener('change', () => {
  if (classConsistentInput.checked === true){
    classFieldSet.disabled = true;
    classInput.value = 0;
    neutralInput.value = 0;
    classOutput.value = 0;
    neutralOutput.value = 0;
  }
});


// Enable/Disable Rarity Checkbox/Slider
const rarityFieldSet = document.getElementById("rarity-fieldset");
const rarityCustomInput = document.getElementById("rarity-custom-input");
const rarityChaosInput = document.getElementById("rarity-chaos-input");
const rarityConsistentInput = document.getElementById("rarity-consistent-input");

rarityCustomInput.addEventListener('change', () => {
  if (rarityCustomInput.checked === true){
    rarityFieldSet.disabled = false;
  } else {
    rarityFieldSet.disabled = true;
  }
});

rarityChaosInput.addEventListener('change', () => {
  if (rarityChaosInput.checked === true){
    rarityFieldSet.disabled = true;
    legendInput.value = 0;
    epicInput.value = 0;
    rareInput.value = 0;
    commonInput.value = 0;
    legendOutput.value = 0;
    epicOutput.value = 0;
    rareOutput.value = 0;
    commonOutput.value = 0;
  }
});

rarityConsistentInput.addEventListener('change', () => {
  if (rarityConsistentInput.checked === true){
    rarityFieldSet.disabled = true;
    legendInput.value = 0;
    epicInput.value = 0;
    rareInput.value = 0;
    commonInput.value = 0;
    legendOutput.value = 0;
    epicOutput.value = 0;
    rareOutput.value = 0;
    commonOutput.value = 0;
  }
});

// Make sliders resposive to each other within each filter category
const classInput = document.getElementById('classInput');
const classOutput = document.getElementById('classOutput');
const neutralInput = document.getElementById('neutralInput');
const neutralOutput = document.getElementById('neutralOutput');
classInput.value = 0;
neutralInput.value = 0;

function handleClassInput() {
  classOutput.value = classInput.value;
  neutralInput.value = 30 - classInput.value;
  neutralOutput.value = neutralInput.value;
}

function handleNeutralInput() {
  neutralOutput.value = neutralInput.value;
  classInput.value = 30 - neutralInput.value;
  classOutput.value = classInput.value;
}


const legendInput = document.getElementById('legendInput');
const legendOutput = document.getElementById('legendOutput');
const epicInput = document.getElementById('epicInput');
const epicOutput = document.getElementById('epicOutput');
const rareInput = document.getElementById('rareInput');
const rareOutput = document.getElementById('rareOutput');
const commonInput = document.getElementById('commonInput');
const commonOutput = document.getElementById('commonOutput');
legendInput.value = 0;
epicInput.value = 0;
rareInput.value = 0;
commonInput.value = 30;
commonOutput.value = 30;
function handleLegendInput() {
  const remainingSlots = 30 - (Number(epicInput.value) + Number(rareInput.value));
  if (legendInput.value > remainingSlots) {
    legendInput.value = remainingSlots;
  }
  legendOutput.value = legendInput.value;

  handleCommonInput();
}

function handleEpicInput() {
  const remainingSlots = 30 - (Number(legendInput.value) + Number(rareInput.value));
  if (epicInput.value > remainingSlots) {
    epicInput.value = remainingSlots;
  }
  epicOutput.value = epicInput.value;

  handleCommonInput();
}

function handleRareInput() {
  const remainingSlots = 30 - (Number(legendInput.value) + Number(epicInput.value));
  if (rareInput.value > remainingSlots) {
    rareInput.value = remainingSlots;
  }
  rareOutput.value = rareInput.value;

  handleCommonInput();
}

function handleCommonInput() {
  const remainingSlots = 30 - (Number(legendInput.value) + Number(epicInput.value) + Number(rareInput.value));
  commonInput.value = remainingSlots;
  commonOutput.value = commonInput.value;
}



const minionInput = document.getElementById('minionInput');
const minionOutput = document.getElementById('minionOutput');
const spellInput = document.getElementById('spellInput');
const spellOutput = document.getElementById('spellOutput');
minionInput.value = 0;
spellInput.value = 0;

function handleMinionInput() {
  minionOutput.value = minionInput.value;
  spellInput.value = 30 - minionInput.value;
  spellOutput.value = spellInput.value;
}

function handleSpellInput() {
  spellOutput.value = spellInput.value;
  minionInput.value = 30 - spellInput.value;
  minionOutput.value = minionInput.value;
}
