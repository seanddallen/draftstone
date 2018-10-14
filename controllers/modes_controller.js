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
        let heroList = '';
        for (const mode of modes) {
          for (const hero of mode.settings.heroArray) {
             heroList += `\n${hero}`;
          }
          mode.heroList = mode.settings.heroArray.length === 0 ? "All" : heroList;
        }
        res.render('modes', { modes: modes, tab: tab, subtab: subtab, errors: req.session.errors, username: null });
        req.session.errors = {
          login: [],
          register: []
        };
        req.session.save();
      });
    } else {
      knex.select('modes.id', 'votes.user_id as hasVoted', 'votes.mode_id').from('modes').leftJoin('votes', 'modes.id', 'votes.mode_id').where('votes.user_id', req.session.user_id).orWhere('votes.user_id', null)
      .then(votes => {
        knex.select('modes.id', 'favorites.user_id as hasFavorited').from('modes').leftJoin('favorites', 'modes.id', 'favorites.mode_id').where('favorites.user_id', req.session.user_id).orWhere('favorites.user_id', null)
        .then(favorites => {
          knex('users')
            .where('id', req.session.user_id)
          .then(results => {
            const user = results[0];
            knex('modes')
              .where('type', tab)
            .then(modes => {
              let heroList = '';
              for (const mode of modes) {
                for (const hero of mode.settings.heroArray) {
                   heroList += `\n${hero}`;
                }
                mode.heroList = mode.settings.heroArray.length === 0 ? "All" : heroList;
              }

              res.render('modes', { votes: votes, favorites: favorites, modes: modes, tab: tab, subtab: subtab, user: req.session.user_id, errors: req.session.errors, username: user.user_name });
              req.session.errors = {
                login: [],
                register: []
              };
              req.session.save();
              })
          })
        });
      });
    }
  },

  // browsemore: (req, res) => {
  //   knex.select('modes.*', 'votes.user_id as hasVoted').from('modes').leftJoin('votes', 'modes.id', 'votes.mode_id').where('votes.user_id', req.session.user_id).orWhere('votes.user_id', null).then(votes => {
  //     knex.select('modes.*', 'favorites.user_id as hasFavorited').from('modes').leftJoin('favorites', 'modes.id', 'favorites.mode_id').where('favorites.user_id', req.session.user_id).orWhere('favorites.user_id', null).then(favorites => {
  //       res.render('modes', {votes:votes, favorites: favorites})
  //     })
  //   })
  // }
};
