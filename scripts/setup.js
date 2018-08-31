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

   localStorage.setItem("masterPool", JSON.stringify(masterPool));
   localStorage.setItem("heroes", JSON.stringify(heroes));

   const draftBtn =  document.getElementById('draft-btn');
   draftBtn.classList.remove("inactive");


   draftBtn.addEventListener('click', e => {
     //new
     let valid = true;

     const setArray = [];
     let setOptions = document.getElementById('select').options;
     for (const set of setOptions) {
       if(set.selected) {
         setArray.push(set.value);
       }
     }
     localStorage.setItem("chosenSets", JSON.stringify(setArray));

     let custom = false;
     //get value of custom checkbox
     if (document.getElementById('checkboxOneInput').checked === true) {
       custom = true;
     }
     localStorage.setItem("custom", custom);
     let customRules = {};

     if (custom) {
       let classCount = document.getElementById('classInput').value;

       let legendaryCount = document.getElementById('legendInput').value;
       let epicCount = document.getElementById('epicInput').value;
       let rareCount = document.getElementById('rareInput').value;

       //new
       if((Number(legendaryCount) + Number(epicCount) + Number(rareCount)) > 30) {
         valid = false;
       }

       let spellCount = document.getElementById('spellInput').value;

       customRules = {
         'classCount': classCount,
         'legendaryCount': legendaryCount,
         'epicCount': epicCount,
         'rareCount': rareCount,
         'spellCount': spellCount
       };
     }
     localStorage.setItem("customRules", JSON.stringify(customRules));



     //new
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
