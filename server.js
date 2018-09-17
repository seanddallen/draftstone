const app = require('express')();
const bodyParser = require('body-parser');
const deckstrings = require('deckstrings');
const port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.post("/encodeDeck", (req, res) => {
  const deck = req.body.deck;
  const heroCard = req.body.heroCard;
  console.log(heroCard);
  const cards = [];
  for (let i = 0; i < 30; i++) {
    if (i < 29 && deck[i].dbfId === deck[i + 1].dbfId) {
      cards.push([deck[i].dbfId, 2]);
      i++;
    }
    else {
      cards.push([deck[i].dbfId, 1]);
    }
  }
  const encodableDeck = {
    'cards': cards,
    heroes: [+ heroCard.cardId.slice(-1)],
    format: 1
  };


  const deckstring = deckstrings.encode(encodableDeck);
  console.log(deckstring);
});

app.listen(port, () => {
  console.log('Listening on', port);
});
