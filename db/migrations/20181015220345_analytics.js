exports.up = function(knex, Promise) {
  return knex.schema.createTable("analytics", table => {
    table.increments();
    table.integer("drafts");
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("analytics");
};
