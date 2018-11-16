const knex = require("../db/knex.js");

module.exports = {

  import: (req, res) => {
    knex('collections')
      .insert({
        name: req.body.name,
        collection: JSON.stringify(req.body.collection),
        user_id: req.session.user_id,
      })
    .then(() => {
      res.redirect('/user')
    })
  },

  update: (req, res) => {
    knex('users')
      .where('id', req.session.user_id)
      .update({
        selected_collection_id: req.params.id
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
