let img1 = document.getElementById('img1');
let img2 = document.getElementById('img2');
let img3 = document.getElementById('img3');
let cardDisplay = document.getElementById('cardDisplay');

//Load 3 random album images

document.addEventListener('DOMContentLoaded', () => {
  axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1', {
    headers: {
      'X-Mashape-Key': 'gAeuReVzM3mshLLX97GlEfieDYDep1H5yDOjsn5z5VlqqZie5Q'
    }
  }).then(response => {
    // let data = response.data;
    console.log('hello');

    // for (let i = 1; i <= 3; i++){
    //   if (i === 1){
    //     img1.setAttribute("src", `./images/${data[Math.floor(Math.random() * data.length)].cover_art}`)
    //   } else if (i === 2){
    //     img2.setAttribute("src", `./images/${data[Math.floor(Math.random() * data.length)].cover_art}`)
    //   } else if (i === 3){
    //     img3.insertAdjacentHTML("beforeend", `
    //       <img src="${card.img}">
    //     `);
    //   }
    // }
  });
});


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
