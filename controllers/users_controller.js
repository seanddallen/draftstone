const knex = require("../db/knex.js");

module.exports = {
  index: (req, res) => {
    res.render('index');
  },

  setup: (req, res) => {
    res.render('setup');
  },

  draft: (req, res) => {
    res.render('draft');
  },

  export: (req, res) => {
    res.render('export');
  },

  modes: (req, res) => {
    res.render('modes');
  },



}
