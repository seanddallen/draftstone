const deck = JSON.parse(localStorage.getItem('deck'));
const heroCard = JSON.parse(localStorage.getItem('heroCard'));

const data = {
  "deck": deck,
  "heroCard": heroCard
};

const exportDeck = document.getElementById('export-deck');
const deckstringInput = document.getElementById('deckstring-input');

axios.post('/export', data)
.then(deckstring => {
  console.log(deckstring);
  exportDeck.addEventListener('click', () => {
    deckstringInput.innerHTML = JSON.stringify(deckstring.data).slice(1,-1);
  });
});






const customRules = JSON.parse(localStorage.getItem("customRules"));

const modeName = document.getElementById('mode-name-input');
const saveModeBtn = document.getElementById('save-mode-btn');
const savePublishBtn = document.getElementById('save-publish-btn');


saveModeBtn.addEventListener('click', e => {
  const modeNameValue = modeName.value;
  if (!modeNameValue) {
    modeName.insertAdjacentHTML('afterend', `
      <p>Please enter a creative game mode name</p>
    `);
  } else {
    axios.post('/modes', {
      mode_name: modeNameValue,
      settings: customRules
    }).then(() => {
      window.location.href = "/modes/user";
    });
  }
});

savePublishBtn.addEventListener('click', e => {
  const modeNameValue = modeName.value;
  if (!modeNameValue) {
    modeName.insertAdjacentHTML('afterend', `
      <p>Please enter a creative game mode name</p>
    `);
  } else {
    axios.post('/modes', {
      mode_name: modeNameValue,
      settings: customRules
    })
    .then(results => {
      const mode_id = results.data;
      axios.post(`/modes/publish/${mode_id}`)
      .then(() => {
        window.location.href = "/modes/user/created";
      }) ;
    });
  }
});
