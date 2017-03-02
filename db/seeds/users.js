exports.seed = function (knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({ id: 1, name: 'Alice', email: "Alice@test.com", password: "password" }),
        knex('users').insert({ id: 2, name: 'Bob', email: "Bob@test.com", password: "password" }),
        knex('users').insert({ id: 3, name: 'Charlie', email: "Charlie@test.com", password: "password" })
      ]);
    });
};