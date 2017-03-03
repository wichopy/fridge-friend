exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function (table) {
  	table.renameColumn('name', 'username');
    table.string('email'); // does not verify @email.com ending atm
    table.string('password'); // does not go through hash process yet.
  })
  .createTable('ingredients', function(table){
  	table.increments();
  	table.string('name');
  })
  .createTable('inventory', function(table){
   	table.increments();

   	table.integer('userId');
   	table.foreign('userId').references('users.id').onDelete('CASCADE');

  	table.integer('ingId');
    table.foreign('ingId').references('ingredients.id');

  	table.integer('pend');
  	table.integer('qty');
  })
  .then(() => {
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', function (table){
  	table.renameColumn('username', 'name');
  	table.dropColumn('email');
    table.dropColumn('password');
  })
  .dropTable('ingredients')
  .dropTable('inventory')
  .then(() => {
  });
};