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

    if (!req.session.user_id) {
      knex('modes')
        .where('type', tab)
      .then(modes => {
        res.render('modes', { modes: modes, tab: tab, subtab: subtab, errors: req.session.errors, username: null });
        req.session.errors = {
          login: [],
          register: []
        };
        req.session.save();
      });
    } else {
      knex('users')
        .where('id', req.session.user_id)
      .then(results => {
        const user = results[0];
        knex('modes')
          .where('type', tab)
        .then(modes => {
          console.log(user);
          res.render('modes', { modes: modes, tab: tab, subtab: subtab, errors: req.session.errors, username: user.user_name });
          req.session.errors = {
            login: [],
            register: []
          };
          req.session.save();
        });
      });
    }
  }

};
