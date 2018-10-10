
exports.up = function(knex, Promise) {
  return knex.schema.createTable('modes', table => {
    table.increments();
    table.string('mode_name');
    table.string('type');
    table.integer('votes').defaultTo(0);
    table.integer('creator_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .index();
    table.json('settings');
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('modes');
};
