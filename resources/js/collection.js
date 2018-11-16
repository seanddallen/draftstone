// const parsed = JSON.parse(req.body.collection)
//     const collection = {}
//     for (const playerClass in parsed) {
//       for (const rarity in parsed[playerClass].cards) {
//         for (const cardKey in parsed[playerClass].cards[rarity]) {
//           const card = parsed[playerClass].cards[rarity][cardKey]
//           const quantity = Math.min(card.normal + card.golden, 2)
//           if (quantity) {
//             collection[card.name] = quantity
//           }
//         }
//       }
//     }

// document.getElementById("importSubmit").addEventListener("click", e => {
//   e.preventDefault()
//   const rawJSON = document.getElementById("collection")
// })