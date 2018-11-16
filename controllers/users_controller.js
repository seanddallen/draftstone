const knex = require("../db/knex.js");
const hasher = require("../config/hasher.js");
const deckstrings = require("deckstrings");
const nodemailer = require('nodemailer');
// const xoauth2 = require('xoauth2');

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

  setupRelative: (req, res) => {
    res.render('setup-relative', {messages: req.session.messages, username: req.session.user_name});
    req.session.messages = {
      loginErrors: [],
      registerErrors: [],
      resetError: [],
      resetSuccess: []
    };
    req.session.save();
  },

  setupAbsolute: (req, res) => {
    res.render('setup-absolute', {messages: req.session.messages, username: req.session.user_name});
    req.session.messages = {
      loginErrors: [],
      registerErrors: [],
      resetError: [],
      resetSuccess: []
    };
    req.session.save();

  },

  draft: (req, res) => {
    knex.select('users.selected_collection_id', 'users.id')
      .from('users')
      .where('users.id', req.session.user_id)
      .then(results => {
        res.render('draft', {messages: req.session.messages, username: req.session.user_name, collection: results
        })
      })
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

  forgotpassword: (req, res) => {
    res.render('password', {messages: req.session.messages});
    req.session.messages = {
      loginErrors: [],
      registerErrors: [],
      resetError: [],
      resetSuccess: []
    };
    req.session.save();
  },

  sendemail: (req, res) => {
    let temporary = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000

    let output = `
      <h3>Instructions</h3>
      <p>You may now login to your account with your email and the new temporary password.</p>
      <p>***IMPORTANT*** Make sure you go in right away and change this to your new password. You can do this by loggin in and clicking your account icon in the upper right corner and then resetting your password.</p>
      <br>
      <b>Temporary Password:</b><span>${temporary}</span>
    `
    // create reusable transporter object using the default SMTP transport

     let transporter = nodemailer.createTransport({

       // service: 'gmail',
       // auth: {
       //   xoauth2: xoauth2.createXOAuth2Generator({
       //     user: 'draftstonebeta@gmail.com',
       //     clientId: '',
       //     clientSecret: '',
       //     refreshToken: '',
       //
       //   })
       // }

       host: 'smtp.gmail.com',
       port: 587,
       secure: false, // true for 465, false for other ports
       auth: {
           user: 'draftstonebeta@gmail.com', // generated ethereal user
           pass: 'g100rocks!' // generated ethereal password
       },
       tls:{
         rejectUnauthorized: false
       }
     });

     // setup email data with unicode symbols
     let mailOptions = {
         from: '"Draftstone Team" <draftstonebeta@gmail.com>', // sender address
         to: 'seanjtayler@gmail.com', // list of receivers  `${req.body.email}`
         subject: 'Temporary Password', // Subject line
         text: '', // plain text body
         html: output // html body
     };

     // send mail with defined transport object
     transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             return console.log(error);
         }
         console.log('Message sent: %s', info.messageId);
         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
     });

     const unhashedUser = {
       password: `${temporary}`
     };
     hasher.hash(unhashedUser)
     .then((updatedUser) => {
       knex('users')
         .where('email', req.body.email)
         .update({
           password: updatedUser.password
         })
         .then(() => {
           req.session.messages.resetSuccess.push("Email Sent!");
           req.session.save(() => {
             res.redirect('/forgotpassword');
             return;
           })
         });
       })
  },

  draftcount: (req, res) => {
    knex('analytics').where('id', 1).increment('drafts', 1)
    .then((drafts)=>{
      res.sendStatus(201);
    });
  },

  account: (req, res) => {
    knex('collections')
      .where('user_id', req.session.user_id)
      .orWhere('id', 1)
      .then(collectionsArray => {
        knex('users')
          .where('id', req.session.user_id)
          .then((users)=>{
            const selectedCollection = collectionsArray.filter(collection => collection.id === users[0].selected_collection_id)[0]
            res.render('account', {users: users, messages: req.session.messages, collections:collectionsArray, username: req.session.user_name, selectedCollection: selectedCollection});
            req.session.messages = {
              loginErrors: [],
              registerErrors: [],
              resetError: [],
              resetSuccess: []
            };
      req.session.save();
      })
    });
  },

  delete: (req, res) => {
    knex('modes')
      .where({"type": "user", "creator_id": req.session.user_id})
      .del()
    .then(() => {
      knex('users').del().where('id', req.session.user_id).then(()=>{
        req.session.destroy(() => {
          res.redirect('/');
        });
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

  encode: (req, res) => {
    const deck = req.body.deck;
    const heroCard = req.body.heroCard;
    const cards = [];
    for (let i = 0; i < 30; i++) {
     if (i < 29 && deck[i].dbfId === deck[i + 1].dbfId) {
       cards.push([+ deck[i].dbfId, 2]);
       i++;
     }
     else {
       cards.push([+ deck[i].dbfId, 1]);
     }
    }
    const encodableDeck = {
     'cards': cards,
     heroes: [+ heroCard.dbfId],
     format: 1
    };


    const deckstring = deckstrings.encode(encodableDeck);
    res.json(deckstring);

  }

};
