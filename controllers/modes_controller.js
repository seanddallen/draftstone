const knex = require("../db/knex.js");
const moment = require("moment");

module.exports = {
  browse: (req, res) => {
    const trendingDaysRange = 30;
    const user_id = req.session.user_id || null;
    const tab = req.params.tab;
    const subtab = req.params.subtab;
    let isSingle = false;

    knex
      .select(
        "modes.*",
        "votes.user_id as hasVoted",
        "favorites.user_id as hasFavorited"
      )
      .from("modes")
      .leftJoin(
        knex("votes")
          .where("votes.user_id", user_id)
          .as("votes"),
        "modes.id",
        "votes.mode_id"
      )
      .leftJoin(
        knex("favorites")
          .where("favorites.user_id", user_id)
          .as("favorites"),
        "modes.id",
        "favorites.mode_id"
      )
      .orderBy("created_at", "desc")
      .then(modes => {
        if (tab === "single") {
          isSingle = true;
          modes = modes.filter(mode => mode.id === +req.params.subtab);
        } else if (tab === "basic") {
          modes = modes.filter(mode => mode.type === "basic");
        } else if (tab === "community") {
          modes = modes.filter(mode => mode.type === "community");
          if (subtab !== "newest") {
            modes.sort((modeA, modeB) => modeB.votes - modeA.votes);
          }
          if (subtab === "trending") {
            modes = modes.filter(mode =>
              moment(mode.created_at).isAfter(
                moment().subtract(trendingDaysRange, "d")
              )
            );
          }
        } else if (subtab === "created") {
          modes = modes.filter(
            mode => mode.creator_id === user_id && mode.type === "user"
          );
        } else {
          modes = modes.filter(mode => mode.hasFavorited);
        }
        let heroList = "";
        for (const mode of modes) {
          for (const hero of mode.settings.heroArray) {
            heroList += `\n${hero}`;
          }
          mode.heroList =
            mode.settings.heroArray.length === 0 ? "All" : heroList;
        }
        res.render("modes", {
          modes: modes,
          tab: tab,
          subtab: subtab,
          messages: req.session.messages,
          username: req.session.user_name,
          isSingle: isSingle
        });
        req.session.messages = {
          loginErrors: [],
          registerErrors: [],
          resetError: [],
          resetSuccess: []
        };
        req.session.save();
      });
  },

  create: (req, res) => {
    let dupe = false;
    knex("modes").then(modes => {
      for (const mode of modes) {
        if (
          mode.type !== "user" &&
          JSON.stringify(mode.settings) == JSON.stringify(req.body.settings)
        ) {
          res.json({ dupe: true, id: mode.id });
          dupe = true;
          return;
        }
      }

      if (!dupe) {
        knex("modes")
          .returning("modes.id")
          .insert({
            mode_name: req.body.mode_name,
            type: "user",
            creator_id: req.session.user_id,
            settings: req.body.settings
          })
          .then(results => {
            res.json(results[0]);
          });
      }
    });
  },

  publish: (req, res) => {
    knex("modes")
      .where("id", req.params.id)
      .returning("*")
      .update({
        published: "true"
      })
      .then(results => {
        let dupe = false;
        knex("modes")
          .then(modes => {
            for (const mode of modes) {
              if (
                mode.type === "community" &&
                JSON.stringify(mode.settings) ==
                  JSON.stringify(results[0].settings)
              ) {
                res.json({ dupe: true, id: mode.id });
                dupe = true;
                return Promise.reject();
              }
            }

            if (!dupe) {
              const mode = results[0];
              if (mode.creator_id === req.session.user_id) {
                return knex("modes").insert({
                  mode_name: mode.mode_name,
                  type: "community",
                  creator_id: mode.creator_id,
                  settings: mode.settings
                });
              }
            }
          })
          .then(() => res.redirect("/modes/user/created"));
      });
  },

  publishExisting: (req, res) => {
    knex("modes")
      .where("id", req.params.id)
      .returning("*")
      .update({
        published: "true"
      })
      .then(results => {
        let dupe = false;
        knex("modes")
          .then(modes => {
            for (const mode of modes) {
              if (
                mode.type === "community" &&
                JSON.stringify(mode.settings) ==
                  JSON.stringify(results[0].settings)
              ) {
                res.redirect(`/modes/single/${mode.id}`);
                dupe = true;
                return Promise.reject();
              }
            }

            if (!dupe) {
              const mode = results[0];
              if (mode.creator_id === req.session.user_id) {
                return knex("modes").insert({
                  mode_name: mode.mode_name,
                  type: "community",
                  creator_id: mode.creator_id,
                  settings: mode.settings
                });
              }
            }
          })
          .then(() => res.redirect("/modes/user/created"));
      });
  },

  delete: (req, res) => {
    knex("modes")
      .where("id", req.params.id)
      .then(results => {
        if (results[0].creator_id === req.session.user_id) {
          knex("modes")
            .where("id", req.params.id)
            .del()
            .then(() => {
              res.redirect("/modes/user/created");
            });
        }
      });
  }

  // browsemore: (req, res) => {
  //   knex.select('modes.*', 'votes.user_id as hasVoted').from('modes').leftJoin('votes', 'modes.id', 'votes.mode_id').where('votes.user_id', req.session.user_id).orWhere('votes.user_id', null).then(votes => {
  //     knex.select('modes.*', 'favorites.user_id as hasFavorited').from('modes').leftJoin('favorites', 'modes.id', 'favorites.mode_id').where('favorites.user_id', req.session.user_id).orWhere('favorites.user_id', null).then(favorites => {
  //       res.render('modes', {votes:votes, favorites: favorites})
  //     })
  //   })
  // }
};
