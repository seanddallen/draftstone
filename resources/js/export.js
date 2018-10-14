const deck = JSON.parse(localStorage.getItem('deck'));
const heroCard = JSON.parse(localStorage.getItem('heroCard'));

const url = "http://localhost:8000/encodeDeck";
const data = {
  "deck": deck,
  "heroCard": heroCard
};

console.log(JSON.stringify(data));
console.log(data.heroCard);
fetch(url, {
  method: "POST",
  mode: "no-cors",
  body: JSON.stringify(data)
}).then(response => response.JSON).then(deckstring => console.log(deckstring));



// copy code to clipboard
// in hearthstone, create new deck while code is in clipboard
// hearthstone will automatically detect the code and offer to craete deck

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
        window.location.href = "/modes/user";
      }) ;
    });
  }
});
