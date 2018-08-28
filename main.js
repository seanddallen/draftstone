///////////////////////// GET DATA /////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1', {
    headers: {
      'X-Mashape-Key': 'gAeuReVzM3mshLLX97GlEfieDYDep1H5yDOjsn5z5VlqqZie5Q'
    }
  }).then(response => {
    // let data = response.data;
    console.log(response);
  });
});

///////////////////////// RENDER PICK /////////////////////////

function renderPick(array) {
  
}

///////////////////////// RENDER DECK /////////////////////////

function renderDeck(array) {
  cardName = document.getElementById('card-name');
  cardCost = document.getElementById('card-cost');

  array.forEach(function(card) {
    cardName.innerHTML += `
      <div class="flex">
        ${card.name}
      </div>
    `
  })

  array.forEach(function(card) {
    cardCost.innerHTML += `
      <div class="flex">
        ${card.cost}
      </div>
    `
  })
}



// axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1', {
//   headers: {
//     'X-Mashape-Key': 'gAeuReVzM3mshLLX97GlEfieDYDep1H5yDOjsn5z5VlqqZie5Q'
//   }
// }).then(response => {
//   const types = [];
//   console.log(response.data);
//   for (const set in response.data) {
//     for (const card of response.data[set]) {
//       //console.log(card);
//       if (!card.hasOwnProperty('cost')) {
//         console.log(card);
//       }
//       if (!types.includes(card.type)) {
//         types.push(card.type);
//       }
//     }
//   }
//   console.log(types);
//   console.log('finished');
// });
