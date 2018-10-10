
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('modes').del()
    .then(function () {
      // Inserts seed entries
      return knex('modes').insert([
        {
          mode_name: 'Wildest Dreams',
          type: "basic",
          creator_id: 2,
        },
        {
          mode_name: 'Standard Procedures',
          type: "basic",
          creator_id: 2,
        },

      ]);
    });
};
