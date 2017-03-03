exports.seed = function (knex, Promise) {
  return knex('users').del()
  .then (() => {knex('ingredients').del()})
  .then (() => {knex('inventory').del()})
  .then (() => {
      return Promise.all([
        knex('ingredients').insert({ name:"broccolie" }),
        knex('users').insert({ username: 'Alice', email: "Alice@test.com", password: "password" }),
        knex('users').insert({ username: 'Bob', email: "Bob@test.com", password: "password" }),
        knex('users').insert({ username: 'Charlie', email: "Charlie@test.com", password: "password" }),
      ])
      .then (() =>{knex('inventory').insert({ userId:1, ingId:1, qty:1})
      });
    })
};
