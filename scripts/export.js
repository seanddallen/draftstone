//
//
// const deck = JSON.parse(localStorage.getItem('deck'));
// const heroCard = JSON.parse(localStorage.getItem('heroCard'));
//
// const cards = [];
// for (let i = 0; i < 30; i++) {
//   if (i < 29 && deck[i].dbfId === deck[i + 1].dbfId) {
//     cards.push([deck[i].dbfId, 2]);
//     i++;
//   }
//   else {
//     cards.push([deck[i].dbfId, 1]);
//   }
// }
// const encodableDeck = {
//   'cards': cards,
//   heroes: [heroCard.dbfId],
//   format: 1
// };
//
// const deckstring = encode(encodableDeck);
// console.log(deckstring);
