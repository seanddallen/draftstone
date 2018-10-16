localStorage.clear();
const masterPool = []; // All collectible cards
const heroes = []; // The nine original heroes to represent classes

document.addEventListener('DOMContentLoaded', () => {
 axios.get('https://omgvamp-hearthstone-v1.p.mashape.com/cards?collectible=1', {
   headers: {
     'X-Mashape-Key': 'gAeuReVzM3mshLLX97GlEfieDYDep1H5yDOjsn5z5VlqqZie5Q'
   }
 }).then(response => {

   // First nine cards of data are the heroes. Add them to heroes array
   for (let i = 0; i < 9; i++) {
     heroes.push(response.data.Basic[i]);
   }

   // Iterate through all cards in data and push non-Hero cards to the master pool
   for (const set in response.data) {
     for (const card of response.data[set]) {
       if (card.type !== "Hero") {
         masterPool.push(card);
       }
     }
   }

   // Save both arrays to local storage in order to be accessed by draft page
   // eventually this will be placed in the server and the API call won't be necessary at all
   localStorage.setItem("masterPool", JSON.stringify(masterPool));
   localStorage.setItem("heroes", JSON.stringify(heroes));




    const modeList = document.getElementById('mode-list');
    modeList.addEventListener('click', e => {
      if (e.target.id.substring(0,4) === "mode" || e.target.parentNode.id.substring(0,4) === "mode") {
        const modeSettings = JSON.parse(document.getElementById(`${e.target.id || e.target.parentNode.id}-input`).value);
        localStorage.setItem('customRules', JSON.stringify(modeSettings));
        window.open("/draft", "_self");
      }
    });
  });
});
