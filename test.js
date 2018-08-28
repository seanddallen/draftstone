axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1', {
  headers: {
    'X-Mashape-Key': 'gAeuReVzM3mshLLX97GlEfieDYDep1H5yDOjsn5z5VlqqZie5Q'
  }
}).then(response => {
  const types = [];
  console.log(response.data);
  for (const set in response.data) {
    for (const card of response.data[set]) {
      //console.log(card);
      if (!card.hasOwnProperty('cost')) {
        console.log(card);
      }
      if (!types.includes(card.type)) {
        types.push(card.type);
      }
    }
  }
  console.log(types);
  console.log('finished');
});
