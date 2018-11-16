exports.up = function(knex, Promise) {
  return knex.schema.createTable('collections', table => {
    table.increments();
    table.string('name');
    table.json('collection');
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('collections');
};
