const deck = JSON.parse(localStorage.getItem("deck"));
const heroCard = JSON.parse(localStorage.getItem("heroCard"));

const data = {
  deck: deck,
  heroCard: heroCard
};

const exportDeck = document.getElementById("export-deck");
const deckstringInput = document.getElementById("deckstring-input");
const clipboard = document.getElementById("clipboard");

axios.post("/export", data).then(deckstring => {
  exportDeck.addEventListener("click", () => {
    deckstringInput.innerHTML = JSON.stringify(deckstring.data).slice(1, -1);
  });
});

//copy to clipboard
function copyToClipboard(id) {
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

const modeName = document.getElementById("mode-name-input");
const saveModeBtn = document.getElementById("save-mode-btn");
const savePublishBtn = document.getElementById("save-publish-btn");

saveModeBtn.addEventListener("click", e => {
  const modeNameValue = modeName.value;
  if (!modeNameValue) {
    const requireText = document.getElementById("require-text");
    requireText.innerText = "Please enter a creative game mode name";
  } else {
    axios
      .post("/modes", {
        mode_name: modeNameValue,
        settings: customRules
      })
      .then(() => {
        window.location.href = "/modes/user";
      });
  }
});

savePublishBtn.addEventListener("click", e => {
  const modeNameValue = modeName.value;
  if (!modeNameValue) {
    const requireText = document.getElementById("require-text");
    requireText.innerText = "Please enter a creative game mode name";
  } else {
    axios
      .post("/modes", {
        mode_name: modeNameValue,
        settings: customRules
      })
      .then(results => {
        const mode_id = results.data;
        axios.post(`/modes/publish/${mode_id}`).then(() => {
          window.location.href = "/modes/user/created";
        });
      });
  }
});
