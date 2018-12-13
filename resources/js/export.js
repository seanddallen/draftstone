const deck = JSON.parse(localStorage.getItem('deck'));
const heroCard = JSON.parse(localStorage.getItem('heroCard'));

const data = {
  "deck": deck,
  "heroCard": heroCard
};

let deckstring
const exportDeck = document.getElementById('export-deck');
const deckstringInput = document.getElementById('deckstring-input');
const clipboard = document.getElementById('clipboard');

//tourney
const deckstringInputModal = document.getElementById('deckstring-input-modal');

axios.post('/export', data)
.then(response => {
  deckstring = response.data
  // exportDeck.addEventListener('click', () => {
    deckstringInput.innerHTML = JSON.stringify(deckstring).slice(1,-1);
  //tourney
    deckstringInputModal.value = JSON.stringify(deckstring).slice(1,-1);
  //});
});


//copy to clipboard
function copyToClipboard(id){
  // Create an auxiliary hidden input
  var aux = document.createElement("input");
  // Get the text from the element passed into the input
  aux.setAttribute("value", deckstringInput.innerHTML);
  // Append the aux input to the body
  document.body.appendChild(aux);
  // Highlight the content
  aux.select();
  // Execute the copy command
  document.execCommand("copy");
  // Remove the input from the body
  document.body.removeChild(aux);
}



const customRules = JSON.parse(localStorage.getItem("customRules"));

const modeName = document.getElementById('mode-name-input');
const saveModeBtn = document.getElementById('save-mode-btn');
const savePublishBtn = document.getElementById('save-publish-btn');


saveModeBtn.addEventListener('click', e => {
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
});

savePublishBtn.addEventListener('click', e => {
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
});


//tourney
const postDeckBtn = document.getElementById('post-deckstring-btn');
const deckName = document.getElementById('deck-name-input')

postDeckBtn.addEventListener('click', e => {
   axios.post('/deckstrings', {
      deck_name: deckName.value,
      string: deckstring
    }).then(({data}) => {
        window.location.href = "/deckstrings";
    });
});