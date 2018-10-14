const knex = require("../db/knex.js");

module.exports = {
  modeVote: (req,res) => {
    knex('votes').where({user_id: req.session.user_id, mode_id: req.params.id}).then((results)=>{
      if(results.length){
        res.redirect('/modes')
      }else{
      knex('votes').insert({
        user_id: req.session.user_id,
        mode_id: req.params.id
      }).then((results)=>{
        return knex('modes').where('id', req.params.id).increment('votes', 1)
      }).then(()=>{
        res.redirect(`/modes/${req.params.tab}/${req.params.subtab}`)
        })
      }
    })
  }
}
