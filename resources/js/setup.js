localStorage.clear();
const masterPool = []; // All collectible cards
const heroes = []; // The nine original heroes to represent classes
let customRules = {};
let notEnoughSpells = false

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
       if (card.type === "Hero" && card.cardSet !== "Basic" && card.cardSet !== "Hero Skins") {
         card.type = "Spell"
       }
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


   const username = document.getElementById("username");
   const saveBtn =  document.getElementById('save-btn');
   if (username) {
     saveBtn.classList.remove("inactive");
     saveBtn.disabled = false;
   }

   // Once the user is ready to draft (either they have chosen settings or foregone doing so), they will click this button
   // The button triggers storing of all their settings to localStorage in order to be retrieved during the draft
   draftBtn.addEventListener('click', e => {
     if(buildSettings()) {
       window.location.href = "/draft";
     }
   });

   saveBtn.addEventListener('click', e => {
     notEnoughSpells = !buildSettings()
   });

 });
});

const modeName = document.getElementById('mode-name-input');
const saveModeBtn = document.getElementById('save-mode-btn');
const savePublishBtn = document.getElementById('save-publish-btn');


saveModeBtn.addEventListener('click', e => {
  if (notEnoughSpells) {
    window.alert('You cannot have more spell cards than class cards. Please fix your settings.')
  } else {
    const modeNameValue = modeName.value;
    if (!modeNameValue) {
      const requireText = document.getElementById('require-text');
      requireText.innerText = "Please enter a creative game mode name";
    } else {
      axios.post('/modes', {
        mode_name: modeNameValue,
        settings: customRules
      }).then(({data}) => {
        if (data.dupe) {
          window.location.href = `/modes/single/${data.id}`;
        } else {
          window.location.href = "/modes/user/created";
        }
      });
    }
  }
  
});

savePublishBtn.addEventListener('click', e => {
  if (notEnoughSpells) {
    window.alert('You cannot have more spell cards than class cards. Please fix your settings.')
  } else {
    const modeNameValue = modeName.value;
    if (!modeNameValue) {
      const requireText = document.getElementById('require-text');
      requireText.innerText = "Please enter a creative game mode name";
    } else {
      axios.post('/modes', {
        mode_name: modeNameValue,
        settings: customRules
      })
      .then(results => {
        if (results.data.dupe) {
          window.location.href = `/modes/single/${results.data.id}`;
        } else {
          const mode_id = results.data;
          axios.post(`/modes/publish/${mode_id}`)
          .then(() => {
            window.location.href = "/modes/user/created";
          }) ;
        }
      });
    }
  }
});



function buildSettings() {

  // Retrieve and store heroes chosen by user
  const heroFilterSetting = document.querySelector('input[name="hero"]:checked').value;
  const heroArray = [];
  if (heroFilterSetting === "custom") {
    let heroOptions = document.getElementById('select-hero').options;
    for (const hero of heroOptions) {
      if (hero.selected) {
        heroArray.push(hero.value);
      }
    }
  }

  // Retrieve and store sets chosen by user
  const setFilterSetting = document.querySelector('input[name="set"]:checked').value;
  const setArray = [];
  if (setFilterSetting === "custom") {
    let setOptions = document.getElementById('select-set').options;
    for (const set of setOptions) {
      if(set.selected) {
        setArray.push(set.value);
      }
    }
  }

  // Retrieve and store sets chosen by user
  const costFilterSetting = document.querySelector('input[name="cost"]:checked').value;
  const costArray = [];
  if (costFilterSetting === "custom") {
    let costOptions = document.getElementById('select-cost').options;
    for (const cost of costOptions) {
      if (cost.selected) {
        costArray.push(cost.value);
      }
    }
  }


  const classSetting = document.querySelector('input[name="class"]:checked').value;
  const raritySetting = document.querySelector('input[name="rarity"]:checked').value;
  const typeSetting = document.querySelector('input[name="type"]:checked').value;

  let classCount = classSetting !== "custom" ? NaN : document.getElementById('classInput').value;

  let legendaryCount = raritySetting !== "custom" ? NaN : document.getElementById('legendInput').value;
  let epicCount = raritySetting !== "custom" ? NaN : document.getElementById('epicInput').value;
  let rareCount = raritySetting !== "custom" ? NaN : document.getElementById('rareInput').value;

  let spellCount = typeSetting !== "custom" ? NaN : document.getElementById('spellInput').value;

  let specifiedClasses = document.getElementById('select-hero').value;


  const filterType = document.querySelector('input[name="mode"]:checked').value;

  console.log('built settings')
  if (filterType === "absolute" && classSetting === "custom" && typeSetting === "custom" && +spellCount > +classCount) {
    window.alert('You cannot have more spell cards than class cards. Please fix your settings.')
    return false
  }

  customRules = {
    'filterType': filterType,
    'heroFilterSetting': heroFilterSetting,
    'heroArray': heroArray,
    'setFilterSetting': setFilterSetting,
    'setArray': setArray,
    'costFilterSetting': costFilterSetting,
    'costArray': costArray,
    'classSetting': classSetting,
    'classCount': classCount,
    'raritySetting': raritySetting,
    'legendaryCount': legendaryCount,
    'epicCount': epicCount,
    'rareCount': rareCount,
    'typeSetting': typeSetting,
    'spellCount': spellCount
  };


  localStorage.setItem("customRules", JSON.stringify(customRules));

  return true


}

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
    });
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
    });
  }
});

// Enable/Disable Set Checkbox/Multiselect
let selectSet = document.getElementById("select-set");
const setAllInput = document.getElementById("set-all-input");
const setCustomInput = document.getElementById("set-custom-input");


setCustomInput.addEventListener('change', () => {
  selectSet = document.getElementById("select-set");
  if (setCustomInput.checked === true){
    selectSet.classList.toggle('faded');
    selectSet.childNodes.forEach((node)=>{
      node.disabled = false;
    });
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
    });
  }
});

// Enable/Disable Cost Checkbox/Multiselect
let selectCost = document.getElementById("select-cost");
const costAllInput = document.getElementById("cost-all-input");
const costCustomInput = document.getElementById("cost-custom-input");


costCustomInput.addEventListener('change', () => {
  selectCost = document.getElementById("select-cost");
  if (costCustomInput.checked === true){
    selectCost.classList.toggle('faded');
    selectCost.childNodes.forEach((node)=>{
      node.disabled = false;
    });
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
    });
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

function handleClassInputRelative() {
  classOutput.value = classInput.value + '%';
  neutralInput.value = 100 - classInput.value;
  neutralOutput.value = neutralInput.value + '%';
}

function handleNeutralInput() {
  neutralOutput.value = neutralInput.value;
  classInput.value = 30 - neutralInput.value;
  classOutput.value = classInput.value;
}

function handleNeutralInputRelative() {
  neutralOutput.value = neutralInput.value + '%';
  classInput.value = 100 - neutralInput.value;
  classOutput.value = classInput.value + '%';
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
// commonInput.value = 30;
// commonOutput.value = 30;
function handleLegendInput() {
  const remainingSlots = 30 - (Number(epicInput.value) + Number(rareInput.value));
  if (legendInput.value > remainingSlots) {
    legendInput.value = remainingSlots;
  }
  legendOutput.value = legendInput.value;

  handleCommonInput();
}

function handleLegendInputRelative() {
  const remainingSlots = 100 - (Number(epicInput.value) + Number(rareInput.value));
  if (legendInput.value > remainingSlots) {
    legendInput.value = remainingSlots;
  }
  legendOutput.value = legendInput.value + '%';

  handleCommonInputRelative();
}

function handleEpicInput() {
  const remainingSlots = 30 - (Number(legendInput.value) + Number(rareInput.value));
  if (epicInput.value > remainingSlots) {
    epicInput.value = remainingSlots;
  }
  epicOutput.value = epicInput.value;

  handleCommonInput();
}

function handleEpicInputRelative() {
  const remainingSlots = 100 - (Number(legendInput.value) + Number(rareInput.value));
  if (epicInput.value > remainingSlots) {
    epicInput.value = remainingSlots;
  }
  epicOutput.value = epicInput.value + '%';

  handleCommonInputRelative();
}

function handleRareInput() {
  const remainingSlots = 30 - (Number(legendInput.value) + Number(epicInput.value));
  if (rareInput.value > remainingSlots) {
    rareInput.value = remainingSlots;
  }
  rareOutput.value = rareInput.value;

  handleCommonInput();
}

function handleRareInputRelative() {
  const remainingSlots = 100 - (Number(legendInput.value) + Number(epicInput.value));
  if (rareInput.value > remainingSlots) {
    rareInput.value = remainingSlots;
  }
  rareOutput.value = rareInput.value + '%';

  handleCommonInputRelative();
}

function handleCommonInput() {
  commonInput.value = 30;
  commonOutput.value = 30;
  const remainingSlots = 30 - (Number(legendInput.value) + Number(epicInput.value) + Number(rareInput.value));
  commonInput.value = remainingSlots;
  commonOutput.value = commonInput.value;
}

function handleCommonInputRelative() {
  commonInput.value = 100;
  commonOutput.value = 100 + '%';
  const remainingSlots = 100 - (Number(legendInput.value) + Number(epicInput.value) + Number(rareInput.value));
  commonInput.value = remainingSlots;
  commonOutput.value = commonInput.value + '%';
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

function handleMinionInputRelative() {
  minionOutput.value = minionInput.value + '%';
  spellInput.value = 100 - minionInput.value;
  spellOutput.value = spellInput.value + '%';
}

function handleSpellInput() {
  spellOutput.value = spellInput.value;
  minionInput.value = 30 - spellInput.value;
  minionOutput.value = minionInput.value;
}

function handleSpellInputRelative() {
  spellOutput.value = spellInput.value + '%';
  minionInput.value = 100 - spellInput.value;
  minionOutput.value = minionInput.value + '%';
}

//Routes for absolute/relative modes

const relative = document.getElementById('relative-input');
const absolute = document.getElementById('absolute-input');

relative.addEventListener('onClick', () => {
  axios.get('/setup/relative').then(res => res.json())
})
