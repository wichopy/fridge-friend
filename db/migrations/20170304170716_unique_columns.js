exports.up = function(knex, Promise) {
  return knex.schema.alterTable('ingredients', function (table) {
    table.unique('name');
  })
  .alterTable('users', function (table){
    table.unique('email');
  })
  .alterTable('inventory', function (table){
    table.unique(['userId', 'ingId']);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('ingredients', function (table) {
    table.dropUnique('name');
  })
  .alterTable('users', function (table){
    table.dropUnique('email');
  })
};
