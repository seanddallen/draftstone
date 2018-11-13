exports.up = function(knex, Promise) {
  return knex.schema.createTable("modes", table => {
    table.increments();
    table.string("mode_name");
    table.string("type");
    table.integer("votes").defaultTo(0);
    table.integer("creator_id");
    table.json("settings");
    table.boolean("published").defaultTo("false");
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("modes");
};
