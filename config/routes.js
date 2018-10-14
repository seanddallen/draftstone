const users  = require("../controllers/users_controller.js");
const modes  = require("../controllers/modes_controller.js");
const votes  = require("../controllers/votes_controller.js");
const favorites  = require("../controllers/favorites_controller.js");

module.exports = function(app){
  app.use(createErrorArr);


  //USER ROUTES
  app.get('/', users.index);
  app.post('/register', users.register);
  app.post('/login', users.login);
  app.get('/logout', users.logout);

  app.get('/setup', users.setup);
  app.get('/draft', users.draft);
  app.get('/export', users.export);

  //MODES ROUTES

  app.get('/modes', modes.browse);           //NOT NEEDED?
  app.get('/modes/:tab', modes.browse);      //NOT NEEDED?
  app.get('/modes/:tab/:subtab', modes.browse);



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

function createErrorArr(req, res, next){
  if(!req.session.errors){
    req.session.errors = {
      login: [],
      register: [],
    };
  }
  next();
}
