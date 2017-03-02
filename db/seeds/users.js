exports.seed = function (knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({ name: 'Alice', email: "Alice@test.com", password: "password" }),
        knex('users').insert({ name: 'Bob', email: "Bob@test.com", password: "password" }),
        knex('users').insert({ name: 'Charlie', email: "Charlie@test.com", password: "password" })
      ]);
    });
};