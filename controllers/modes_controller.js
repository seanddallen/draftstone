const knex = require("../db/knex.js");

module.exports = {

  browse: (req, res) => {
    const type = req.params.type || 'community';
    knex('modes')
      .where('type', type)
    .then(modes => {
      res.render('modes', { modes: modes, type: type });
    });
  },


};
