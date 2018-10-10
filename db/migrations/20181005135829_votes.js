
exports.up = function(knex, Promise) {
  return knex.schema.createTable('votes', table => {
    table.increments();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.integer('mode_id')
      .notNullable()
      .references('id')
      .inTable('modes')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('votes');
};
