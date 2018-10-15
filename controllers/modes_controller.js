const knex = require("../db/knex.js");

module.exports = {

  browse: (req, res) => {
    const tab = req.params.tab;
    const subtab = req.params.subtab;

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
      knex('users')
        .where('id', req.session.user_id)
      .then(results => {
        const user = results[0];
        knex.select('modes.*', 'votes.user_id as hasVoted', 'favorites.user_id as hasFavorited')
          .from('modes')
          .leftJoin(
            knex('votes')
              .where('votes.user_id', req.session.user_id)
              .as('votes'),
            'modes.id','votes.mode_id')
          .leftJoin(
            knex('favorites')
              .where('favorites.user_id', req.session.user_id)
              .as('favorites'),
              'modes.id','favorites.mode_id')
          .where('modes.type',tab)
        .then(modes => {
          let heroList = '';
          for (const mode of modes) {
            for (const hero of mode.settings.heroArray) {
               heroList += `\n${hero}`;
            }
            mode.heroList = mode.settings.heroArray.length === 0 ? "All" : heroList;
          }
          res.render('modes', { modes: modes, tab: tab, subtab: subtab, errors: req.session.errors, username: user.user_name });
          req.session.errors = {
            login: [],
            register: []
          };
          req.session.save();
        });
      });
    }
  },

  create: (req, res) => {
    knex('modes')
      .returning('modes.id')
      .insert({
        mode_name: req.body.mode_name,
        type: "user",
        creator_id: req.session.user_id,
        settings: req.body.settings
      })
    .then((results) => {
      res.json(results[0]);
    });
  },

  publish: (req, res) => {
    knex('modes')
      .where('id', req.params.id)
    .then(results => {
      const mode = results[0];
      return knex('modes')
        .insert({
          mode_name: mode.mode_name,
          type: 'community',
          creator_id: mode.creator_id,
          settings: mode.settings
        });
    })
    .then(() => res.sendStatus(201));
  }

  // browsemore: (req, res) => {
  //   knex.select('modes.*', 'votes.user_id as hasVoted').from('modes').leftJoin('votes', 'modes.id', 'votes.mode_id').where('votes.user_id', req.session.user_id).orWhere('votes.user_id', null).then(votes => {
  //     knex.select('modes.*', 'favorites.user_id as hasFavorited').from('modes').leftJoin('favorites', 'modes.id', 'favorites.mode_id').where('favorites.user_id', req.session.user_id).orWhere('favorites.user_id', null).then(favorites => {
  //       res.render('modes', {votes:votes, favorites: favorites})
  //     })
  //   })
  // }
};
