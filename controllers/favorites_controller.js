const knex = require("../db/knex.js");

module.exports = {
  modeFavorite: (req,res) => {
    knex('favorites').where({user_id: req.session.user_id, mode_id: req.params.id}).then((results)=>{
      if(results.length){
        res.redirect('/modes')
      }else{
      knex('favorites').insert({
        user_id: req.session.user_id,
        mode_id: req.params.id
      }).then(()=>{
        res.redirect(`/modes/${req.params.tab}/${req.params.subtab}`)
        })
      }
    })
  }
}
