const knex = require("../db/knex.js");

module.exports = {
  index: (req, res) => {
    knex('deckstrings')
    .then(results => {
      res.render('deckstrings', {messages: req.session.messages, username: req.session.user_name, deckstrings: results});
      req.session.messages = {
        loginErrors: [],
        registerErrors: [],
        resetError: [],
        resetSuccess: [],
        importError: []
      };
      req.session.save();
    })
  },

  create: (req, res) => {
    knex('deckstrings')
      .insert({
      deck_name: req.body.deck_name,
      string: req.body.string,
    })
    .then(() => {
      res.sendStatus(200)
    })
  }
}