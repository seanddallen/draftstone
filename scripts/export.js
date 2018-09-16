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
