
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          user_name: 'lschuab',
          password: 'as',
          email: 'lschuab@gmail.com',
        },
        {
          user_name: 'sean',
          password: 'yes',
          email: 'sean@gmail.com',
        },
      ]);
    });
};
