
exports.up = function(knex, Promise) {
  return knex.schema.createTable('deckstrings', table => {
    table.increments()
    table.string('deck_name')
    table.text('string')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('deckstrings')
};
