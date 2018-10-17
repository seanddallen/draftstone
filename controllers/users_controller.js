const knex = require("../db/knex.js");
const hasher = require("../config/hasher.js");


module.exports = {
  index: (req, res) => {
    res.render('index', {messages: req.session.messages, username: req.session.user_name});
    req.session.messages = {
      loginErrors: [],
      registerErrors: [],
      resetError: [],
      resetSuccess: []
    };
    req.session.save();
  },

  setup: (req, res) => {
    res.render('setup', {messages: req.session.messages, username: req.session.user_name});
    req.session.messages = {
      loginErrors: [],
      registerErrors: [],
      resetError: [],
      resetSuccess: []
    };
    req.session.save();

  },

  draft: (req, res) => {
    res.render('draft', {messages: req.session.messages, username: req.session.user_name});
    req.session.messages = {
      loginErrors: [],
      registerErrors: [],
      resetError: [],
      resetSuccess: []
    };
    req.session.save();
  },

  export: (req, res) => {
    res.render('export', {messages: req.session.messages, username: req.session.user_name});
    req.session.messages = {
      loginErrors: [],
      registerErrors: [],
      resetError: [],
      resetSuccess: []
    };
    req.session.save();
  },

  register: (req, res) => {
    hasher.hash(req.body).then((user)=>{
    knex('users')
      .insert({
        user_name: user.username,
        email: user.email,
        password: user.password,
      })
    .then(() => res.redirect('/'))
    .catch(err =>  {
      console.log(err);
      if (err.code == 23505) {
        req.session.messages.registerErrors.push("User with that email already exists.");
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
        req.session.messages.loginErrors.push("Email or password incorrect.");
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
            });
          } else {
            req.session.messages.loginErrors.push("Email or password incorrect.");
            req.session.save(() => {
              res.redirect('/');
              return;
            });
          }
        });
      }
    });
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  },

  draftcount: (req, res) => {
    knex('analytics').where('id', 1).increment('drafts', 1)
    .then((drafts)=>{
      res.sendStatus(201);
    });
  },

  account: (req, res) => {
    knex('users').where('id', req.session.user_id).then((users)=>{
      res.render('account', {users: users, messages: req.session.messages, username: req.session.user_name});
      req.session.messages = {
        loginErrors: [],
        registerErrors: [],
        resetError: [],
        resetSuccess: []
      };
      req.session.save();
    });
  },

  delete: (req, res) => {
    knex('users').del().where('id', req.session.user_id).then(()=>{
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  },

  password: (req, res) => {
    knex('users')
      .where('id', req.session.user_id)
    .then((results)=>{
      let user = results[0];
      hasher.check(user, req.body)
      .then((isMatch) => {
        if(isMatch){
          unhashedUser = {
            password: req.body.newpassword
          };
          hasher.hash(unhashedUser)
          .then((updatedUser) => {
            knex('users')
              .where('id', req.session.user_id)
              .update({
                password: updatedUser.password
              })
            .then(() => {
              req.session.messages.resetSuccess.push("Password updated!");
              req.session.save(() => {
                res.redirect('/user');
                return;
              });
            });
          });
        } else {
          req.session.messages.resetError.push("Password incorrect.");
          req.session.save(() => {
            res.redirect('/user');
            return;
          });
        }
      });
    });
  },

};
