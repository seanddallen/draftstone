const hasher = require("../../config/hasher.js");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      const leandro = {
        user_name: 'lschuab',
        password: 'as',
        email: 'lschuab@gmail.com',
      };
      const sean = {
        user_name: 'sean',
        password: 'yes',
        email: 'sean@gmail.com',
      };

      const promiseArr = [];

      promiseArr.push(hasher.hash(leandro).then(leandro => {
        return knex('users').insert({
          user_name: leandro.user_name,
          password: leandro.password,
          email: leandro.email
        });
      }));
      promiseArr.push(hasher.hash(sean).then(sean => {
        return knex('users').insert({
          user_name: sean.user_name,
          password: sean.password,
          email: sean.email
        });
      }));

      return Promise.all(promiseArr);


    });
};
