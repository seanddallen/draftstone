const knex = require("../db/knex.js");

module.exports = {

  browse: (req, res) => {
    const tab = req.params.tab || 'community';
    let subtab = null;
    if (tab === "community") {
      subtab = req.params.subtab || 'trending';
    }
    if (tab === "user") {
      subtab = req.params.subtab || 'created';
    }
      knex('modes')
        .where('type', tab)
      .then(modes => {
        res.render('modes', { modes: modes, tab: tab, subtab: subtab });
      });
  }

};
