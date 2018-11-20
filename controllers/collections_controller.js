const knex = require("../db/knex.js");

module.exports = {

  import: (req, res) => {
    try {
      const parsed = JSON.parse(req.body.collection)
      const collection = {}
      for (const playerClass in parsed) {
        for (const rarity in parsed[playerClass].cards) {
          for (const cardKey in parsed[playerClass].cards[rarity]) {
            const card = parsed[playerClass].cards[rarity][cardKey]
            const quantity = Math.min(card.normal + card.golden, 2)
            if (quantity) {
              collection[card.name] = quantity
            }
          }
        }
      }
      knex('collections')
        .insert({
          name: req.body.name,
          collection: JSON.stringify(collection),
          user_id: req.session.user_id,
        })
      .then(() => {
        res.redirect('/user')
      })
    }
    catch(error) {
      console.log(error)
      req.session.messages.importError.push("Collection is not formatted correctly.")
      req.session.save(() => {
        res.redirect('/user')
        return
      })
    }
  },

  update: (req, res) => {
    const parsed = JSON.parse(req.body.collection)
    const collection = {}
    for (const playerClass in parsed) {
      for (const rarity in parsed[playerClass].cards) {
        for (const cardKey in parsed[playerClass].cards[rarity]) {
          const card = parsed[playerClass].cards[rarity][cardKey]
          const quantity = Math.min(card.normal + card.golden, 2)
          if (quantity) {
            collection[card.name] = quantity
          }
        }
      }
    }
    knex('collections')
      .where('id', req.params.id)
      .update({
        collection: JSON.stringify(collection)
      })
    .then(() => {
      res.redirect('/user')
    })
  },

  delete: (req, res) => {
    knex('collections')
      .where('id', req.params.id)
      .del()
    .then(() => {
      res.redirect('/user')
    })
  },

  selected: (req, res) => {
    knex('users')
      .where('id', req.session.user_id)
      .update({
        selected_collection_id: req.params.id
      })
    .then(() => {
      res.redirect('/user')
    })
  }

}
