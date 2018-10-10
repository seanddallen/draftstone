const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('resources'));

require('./config/sessions')(app);

app.set('view engine', 'ejs');

var routes_setter = require('./config/routes.js');
routes_setter(app);

app.listen(port, function() {
  console.log('Listening on', port);
});



// const deckstrings = require('deckstrings');
//
//
//
// app.post("/encodeDeck", (req, res) => {
//   const deck = req.body.deck;
//   const heroCard = req.body.heroCard;
//   console.log(heroCard);
//   const cards = [];
//   for (let i = 0; i < 30; i++) {
//     if (i < 29 && deck[i].dbfId === deck[i + 1].dbfId) {
//       cards.push([deck[i].dbfId, 2]);
//       i++;
//     }
//     else {
//       cards.push([deck[i].dbfId, 1]);
//     }
//   }
//   const encodableDeck = {
//     'cards': cards,
//     heroes: [+ heroCard.cardId.slice(-1)],
//     format: 1
//   };
//
//
//   const deckstring = deckstrings.encode(encodableDeck);
//   console.log(deckstring);
// });
