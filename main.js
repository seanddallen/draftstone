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
  img0 = document.getElementById('img0');
  img1 = document.getElementById('img1');
  img2 = document.getElementById('img2');

  img0.innerHTML = `<img id="img0" class="responsive" src="${array[0].img}" alt="">`
  img1.innerHTML = `<img id="img1" class="responsive" src="${array[1].img}" alt="">`
  img2.innerHTML = `<img id="img2" class="responsive" src="${array[2].img}" alt="">`
}

// const sampleDeck3 = [{"cardId":"EX1_162","dbfId":"985","name":"Dire Wolf Alpha","cardSet":"Classic","type":"Minion","faction":"Neutral","rarity":"Common","cost":2,"collectible":true,"playerClass":"Neutral","img":"http://media.services.zam.com/v1/media/byName/hs/cards/enus/EX1_162.png"},{"cardId":"EX1_044","dbfId":"791","name":"QuestingAdventurer","cardSet":"Classic","type":"Minion","faction":"Alliance","rarity":"Rare","cost":3,"attack":2,"health":2,"text":"Whenever you play a card, gain +1/+1.","flavor":"\"Does anyone have some extra Boar Pelts?\"","artist":"Attila Adorjany","collectible":true,"playerClass":"Neutral","img":"http://media.services.zam.com/v1/media/byName/hs/cards/enus/EX1_044.png"},{"cardId":"OG_161","dbfId":"38545","name":"Corrupted Seer","cardSet":"Whispers of the Old Gods","type":"Minion","rarity":"Rare","cost":6,"collectible":true,"race":"Murloc","playerClass":"Neutral","img":"http://media.services.zam.com/v1/media/byName/hs/cards/enus/OG_161.png"}];
//
// renderPick(sampleDeck3);

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
