
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('user_name');
    table.string('password');
    table.string('email').unique();
    table.integer('selected_collection_id').defaultTo(1);
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
