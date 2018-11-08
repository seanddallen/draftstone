const users  = require("../controllers/users_controller.js");
const modes  = require("../controllers/modes_controller.js");
const votes  = require("../controllers/votes_controller.js");
const favorites  = require("../controllers/favorites_controller.js");

module.exports = function(app){
  app.use(createMessageArr);

  //ANALYTICS ROUTES
  app.post('/draftcount', users.draftcount);

  //USER ROUTES
  app.get('/', users.index);
  app.post('/register', users.register);
  app.post('/login', users.login);
  app.get('/logout', users.logout);
  app.get('/forgotpassword', users.forgotpassword);
  app.post('/sendemail', users.sendemail);

  app.get('/setup/relative', users.setupRelative);
  app.get('/setup/absolute', users.setupAbsolute);
  app.get('/draft', users.draft);
  app.get('/export', users.export);
  app.post('/export', users.encode);

  //MODES ROUTES

  app.get('/modes/:tab/:subtab', modes.browse);

  app.use(authenticateUser);
  app.get('/user', users.account);
  app.post('/user/delete', users.delete);
  app.post('/user/resetpassword', users.password);
  app.post('/modes', modes.create);
  app.post('/modes/publish/:id', modes.publish);
  app.post('/modes/publish_existing/:id', modes.publishExisting);
  app.post('/modes/delete/:id', modes.delete);

  //VOTES ROUTES

  app.post('/modes/vote/:id/:tab/:subtab', votes.modeVote); //COMPLETE

  //FAVORITES ROUTES

  app.post('/modes/favorite/:id/:tab/:subtab', favorites.modeFavorite); //COMPLETE

};

function authenticateUser(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/');
  } else {
    next();
  }
}

function createMessageArr(req, res, next){
  if(!req.session.messages){
    req.session.messages = {
      loginErrors: [],
      registerErrors: [],
      resetError: [],
      resetSuccess: []
    };
  }
  next();
}
