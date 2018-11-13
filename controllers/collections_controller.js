const knex = require("../db/knex.js");

module.exports = {
  import: (req, res) => {
    res.redirect('index', {});
  },
  update: (req, res) => {
    res.redirect('index', {});
  },
  delete: (req, res) => {
    knex('collections')
      .where('id', req.params.id)
      .del()
    .then(() => {
      res.redirect('/user')
    })
  }


}
