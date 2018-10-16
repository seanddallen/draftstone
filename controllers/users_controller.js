const knex = require("../db/knex.js");
const hasher = require("../config/hasher.js");


module.exports = {
  index: (req, res) => {
    res.render('index', {errors: req.session.errors, username: req.session.user_name});
    req.session.errors = {
      login: [],
      register: []
    };
    req.session.save();
  },

  setup: (req, res) => {
    res.render('setup', {errors: req.session.errors, username: req.session.user_name});
    req.session.errors = {
      login: [],
      register: []
    };
    req.session.save();

  },

  draft: (req, res) => {
    res.render('draft', {errors: req.session.errors, username: req.session.user_name});
    req.session.errors = {
      login: [],
      register: []
    };
    req.session.save();
  },

  export: (req, res) => {
    res.render('export', {errors: req.session.errors, username: req.session.user_name});
    req.session.errors = {
      login: [],
      register: []
    };
    req.session.save();
  },

  register: (req, res) => {
    hasher.hash(req.body).then((user)=>{
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
  });
  },

  login: (req, res) => {
    knex('users')
      .where('email', req.body.email)
    .then(results => {
      const user = results[0];
      if (!user) {
        req.session.errors.login.push("Email or password incorrect.");
        req.session.save(() => {
          res.redirect('/');
          return;
        });
      }
      if(user){
        hasher.check(user, req.body).then((isMatch)=>{
          if(isMatch){
            req.session.user_id = user.id;
            req.session.user_name = user.user_name;
            req.session.save(() => {
              res.redirect('/');
            })
            }
          })
      } else {
        req.session.errors.login.push("Email or password incorrect.");
        req.session.save(() => {
          res.redirect('/');
          return;
        });
      }
    })
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  },

  draftcount: (req, res) => {
    knex('analytics').where('id', 1).increment('drafts', 1)
    .then((drafts)=>{
      console.log(drafts)
    })
  }


};
