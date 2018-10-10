const knex = require("../db/knex.js");

module.exports = {
  index: (req, res) => {
    res.render('index', {errors: req.session.errors});
    req.session.errors = {
      login: [],
      register: []
    };
    req.session.save();
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

  register: (req, res) => {
    knex('users')
      .insert({
        user_name: req.body.username,
        email: req.body.email,
        password: req.body.password,
      })
    .then(() => res.redirect('/'))
    .catch(err =>  {
      console.log(err);
      if (err.code == 23505) {
        req.session.errors.register.push("User with that email already exists.");
      }
      req.session.save(() => {
        res.redirect('/');
      });
    });
  }


};
