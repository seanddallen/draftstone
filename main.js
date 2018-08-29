///////////////////////// GET DATA /////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1', {
    headers: {
      'X-Mashape-Key': 'gAeuReVzM3mshLLX97GlEfieDYDep1H5yDOjsn5z5VlqqZie5Q'
    }
  }).then(response => {
    // let data = response.data;
    console.log(response.data);
  });
});

///////////////////////// RENDER PICK /////////////////////////

function renderPick(array) {
  //append 3 images. Add 3 Ids (img0-img2)
}

///////////////////////// RENDER DECK /////////////////////////

function renderDeck(array) {
  cardName = document.getElementById('card-name');
  cardCost = document.getElementById('card-cost');

  array.forEach(function(card) {
    cardName.innerHTML += `
      <div class="flex name-style">
        ${card.name}
      </div>
    `
  })

  array.forEach(function(card) {
    cardCost.innerHTML += `
      <div class="flex cost-style">
        ${card.cost}
      </div>
    `
  })
}

// const sampleDeck30 = [{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"},{"cost":"2","name":"current card"}];
//
// renderDeck(sampleDeck30);





///////////////////////// FIND DATA /////////////////////////

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
