const users  = require("../controllers/users_controller.js")
const modes  = require("../controllers/modes_controller.js")
const votes  = require("../controllers/votes_controller.js")
const favorites  = require("../controllers/favorites_controller.js")

module.exports = function(app){


  //USER ROUTES
  app.get('/', users.index);
  app.get('/setup', users.setup);
  app.get('/draft', users.draft)
  app.get('/export', users.setup)
  app.get('/modes', users.modes)

  //MODES ROUTES

  //VOTES ROUTES

  //FAVORITES ROUTES


}
