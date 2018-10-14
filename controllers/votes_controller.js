const knex = require("../db/knex.js");

module.exports = {
  modeVote: (req,res) => {
    //Delete and Decrement if voted
    knex('votes').where({user_id: req.session.user_id, mode_id: req.params.id}).then((results)=>{
      if(results.length){
        knex('votes').delete().where({user_id: req.session.user_id, mode_id: req.params.id}).then(()=>{
          return knex('modes').where('id', req.params.id).decrement('votes', 1)
        }).then(()=>{
        res.redirect(`/modes/${req.params.tab}/${req.params.subtab}`)
      })}
    //Insert and Increment if not voted
      else {
        knex('votes').insert({
          user_id: req.session.user_id,
          mode_id: req.params.id
        }).then(()=>{
          return knex('modes').where('id', req.params.id).increment('votes', 1)
        }).then(()=>{
          res.redirect(`/modes/${req.params.tab}/${req.params.subtab}`)
          })
        }
      })
    }
  }
