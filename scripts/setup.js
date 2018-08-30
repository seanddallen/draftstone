localStorage.clear();
const masterPool = []; // All collectible cards
const heroes = []; // The nine original heroes to represent classes

///////////////////////// START DRAFT /////////////////////////

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
    let classCount = document.getElementById('classInput').value;
    let neutralCount = document.getElementById('neutralInput').value;

    let legendaryCount = document.getElementById('legendInput').value;
    let epicCount = document.getElementById('epicInput').value;
    let rareCount = document.getElementById('rareInput').value;

    let minionCount = document.getElementById('minionInput').value;
    let spellCount = document.getElementById('spellInput').value;

    const setArray = [];
    let setOptions = document.getElementById('select').options;
    for (const set of setOptions) {
      if(set.selected) {
        setArray.push(set.value);
      }
    }

    const formatRules = {
      'classCount': classCount,
      'neutralCount': neutralCount, // 30 - class
      'legendaryCount': legendaryCount,
      'epicCount': epicCount,
      'rareCount': rareCount,
      'minionCount': minionCount, //30 - spell
      'spellCount': spellCount,
      'setArray': setArray
    };


    localStorage.setItem("formatRules", JSON.stringify(formatRules));

    console.log(localStorage.getItem("formatRules"));

    //document.getElementById('neutralInput').value -= 1;


    window.location.href = "draft.html";
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
