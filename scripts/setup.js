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
     // Flag for representing validity of chosen settings. Assume true to start
     let valid = true;

     // Retrieve and store sets chosen by user
     const setArray = [];
     let setOptions = document.getElementById('select-set').options;
     for (const set of setOptions) {
       if(set.selected) {
         setArray.push(set.value);
       }
     }
     localStorage.setItem("chosenSets", JSON.stringify(setArray));

     // When page loads, the custom slector is inactive, so initiate custom flag to be false
     let custom = false;
     //get value of custom checkbox
     if (document.getElementById('checkboxOneInput').checked === true) {
       custom = true;
     }
     localStorage.setItem("custom", custom);


     // Read, build object and store custom rules
     let customRules = {};
     if (custom) {
       let classCount = document.getElementById('classInput').value;

       let legendaryCount = document.getElementById('legendInput').value;
       let epicCount = document.getElementById('epicInput').value;
       let rareCount = document.getElementById('rareInput').value;

       let spellCount = document.getElementById('spellInput').value;

       customRules = {
         'classCount': classCount,
         'legendaryCount': legendaryCount,
         'epicCount': epicCount,
         'rareCount': rareCount,
         'spellCount': spellCount
       };

       // Check if rarity choices exceed 30 and set validity to false if so
       // This will go away once we add the logic to tie all the rarity sliders together
       if((Number(legendaryCount) + Number(epicCount) + Number(rareCount)) > 30) {
         valid = false;
       }
     }
     localStorage.setItem("customRules", JSON.stringify(customRules));



     // If invalid, alert the user and stop the button from pointing to draft page
     // This too will disappear once the rarity sliders are fixed, but a similar logic will be useful for checking if there are enough cards for a full draft
     if (!valid) {
       alert("Legendary, Epic, and Rare cards add up to more than 30. Nice try!");
     } else {
       window.location.href = "draft.html";
     }

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

//Enable Sliders when checkbox selected
checkbox = document.getElementById("checkboxOneInput");
fieldSet = document.getElementById("main-fieldset");

checkbox.addEventListener('change', () => {
  console.log('change')
  if (checkbox.checked === true){
    fieldSet.disabled = false;
  } else {
    fieldSet.disabled = true;
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
