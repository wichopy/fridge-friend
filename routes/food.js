"use strict";

const express = require('express');
const food = express.Router();

module.exports = (knex, Mailgun) => {

  food.get("/", (req, res) => {
    console.log(req.body)
    if (req.session.user_id) {
      knex
        .select("*")
        .from("users")
        .where({ id: req.session.user_id })
        .then((results) => {
          let templateVars = {
            id: results[0].id,
            name: results[0].username
          }
          res.status(200).render("food", templateVars);
        });
    } else {
      res.redirect("/");
    }
  });

  food.post("/shopping", (req, res) => {

    let curFood = req.body["food-item"];
    // let curQty = req.body["food-qty"];
    let userId = req.session.user_id;
    let queries = [];
    if (!userId) {
      return res.redirect("/");
    }
    if (curFood) {
      let appendIng = knex.raw(`INSERT INTO ingredients (name) VALUES (?) ON CONFLICT (name)
          DO UPDATE SET name = ingredients.name RETURNING ID`, [curFood])
        .then((result) => {

          return knex.raw(`INSERT INTO inventory ("userId", "ingId","pend","qty") VALUES (${userId},${result.rows[0].id},1,0) ON CONFLICT ("userId", "ingId")
              DO NOTHING`);
        });
      queries.push(appendIng);
    }

    Promise.all(queries).then(() => {
      res.status(200).send();
    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
  });

  // let appendInv = new Promise((resolve,reject) => {
  //   knex.select("userId")
  //   .from("inventory")
  //   .where({ingId: ingIndex})
  //   .then ((results) => {
  //     if (userId in results){
  //       let invTotal = 0;
  //       knex.select("pend")
  //         .from("inventory")
  //         .where({
  //           ingId: ingIndex,
  //           userId: userId
  //         })
  //         .then ((results) => {
  //           invTotal = results[0] + foodQty[index];
  //         })

  //       knex('inventory')
  //         .where({
  //           id: userId
  //         })
  //         .update({
  //           pend: invTotal
  //         });

  //     } else {
  //       knex("ingredients").insert({
  //         userId: userId,
  //         ingId: ingIndex,
  //         pend: foodQty[index],
  //         qty: 0
  //       }); // knex insert
  //     } // else statement
  //   }); // .then
  // }); // Promise, end.


  // Purchase button is clicked: removes from shopping list and appends under inventory list

  food.post("/inventory", (req, res) => {
    let userId = req.session.user_id;
    if (!userId) {
      return res.redirect("/");
    }

    let curFood = req.body["food-item"];
    knex.select("id").from("ingredients").where({ name: curFood })
      .then((result) => {
        return knex('inventory')
          .where({
            userId: userId,
            ingId: result[0].id
          })
          .update({
            pend: 0,
            qty: 1
          })
      })
      .then(() => {
        res.status(200).send();
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  });

  // deletes item from pending inventory
  food.delete("/delPend", (req, res) => {
    let userId = req.session.user_id;
    if (!userId) {
      return res.redirect("/");
    }
    let curFood = req.body["food-item"];
    knex.select("id").from("ingredients").where({ name: curFood })
      .then((result) => {
        return knex('inventory')
          .where({
            userId: userId,
            ingId: result[0].id
          })
          .update({
            pend: 0
          })
      })
      .then(() => {
        return knex("inventory")
          .where({
            pend: 0,
            qty: 0
          })
          .del();
      })

    .then(() => {
        res.status(200).send()
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  });

  food.delete("/delInv", (req, res) => {
    let userId = req.session.user_id;
    if (!userId) {
      return res.redirect("/");
    }
    let curFood = req.body["food-item"];
    knex.select("id").from("ingredients").where({ name: curFood })
      .then((result) => {
        return knex('inventory')
          .where({
            userId: userId,
            ingId: result[0].id
          })
          .update({
            qty: 0
          })
      })
      .then(() => {
        return knex("inventory")
          .where({
            pend: 0,
            qty: 0
          })
          .del();
      })

    .then(() => {
        res.status(200).send()
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  });

  food.post("/mailgun", (req, res) => {

    var api_key = 'key-8ebca617637b06e8626f753fff350232';
    var domain = 'sandbox06ad5db075d3448e9d0e02b238908ab4.mailgun.org';
    var from_who = 'W.CHOU06@GMAIL.COM;
    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({ apiKey: api_key, domain: domain });
    // user's email, user's shopping list

    // going for email+shopping list...
    knex("inventory")
      .join('users', 'userId', 'users.id')
      .join('ingredients', 'ingId', 'ingredients.id')
      .select("users.email", "ingredients.name")
      .where({ userId: req.session.user_id, pend: 1 })
      .then((result) => {
        console.log(result);
        let shoppingList = "<ul>";
        for (var each of result) {
          shoppingList += `<li>${each.name}</li>`;
        }
        shoppingList += '</ul>';
        var data = {
            //Specify email data
            from: from_who,
            //The email to contact
            to: result[0].email,
            //Subject and text data
            subject: 'Your shopping list has arrived',
            html: `<h2>Shopping List</h2>${shoppingList}`
          }
          // Invokes the method to send emails given the above data with the helper library
        mailgun.messages().send(data, function (err, body) {
          // If there is an error, render the error page
          if (err) {
            console.log("got an error: ", err);
            res.sendStatus(500);
          } else {
            // Else we can greet and leave
            res.sendStatus(200);
            console.log(body);
          }
        });

      })
  });
  const request = require('request');


  food.get("/shopping", (req, res) => {
    let userId = req.session.user_id;
    if (!userId) {
      return res.redirect("/");
    }
    // select ingredients
    knex
      .select("ingredients.name") // ingId
      .from("inventory")
      .join('ingredients', 'ingId', 'ingredients.id')
      .where({
        "userId": userId,
        qty: 0
      })
      .then((result) => {
        let ingList = [];
        for (let ingredient of result) {
          ingList.push(ingredient);
        }
        let templateVars = {
          id: userId,
          items: ingList
        }
        res.json(ingList);
      });
  });

  food.get("/inventory", (req, res) => {
    let userId = req.session.user_id;
    if (!userId) {
      return res.redirect("/");
    }
    // select ingredients
    knex
      .select("ingredients.name") // ingId
      .from("inventory")
      .join('ingredients', 'ingId', 'ingredients.id')
      .where({
        'userId': userId,
        qty: 1
      })
      .then((result) => {
        let ingList = [];
        for (let ingredient of result) {
          ingList.push(ingredient);
        }
        let templateVars = {
          id: userId,
          items: ingList
        }
        res.json(ingList);
      });
  });


  // Recipe button is clicked, places all elements in a str.
  food.post("/recipes", (req, res) => {
    // console.log(req.body);
    if (req.session.user_id) {
      console.log(req.body);
      let url = `http://food2fork.com/api/search?key=a6d38b7fdc69b588f290a8a5ca84f127&q=`
      for (let i = 0; i < req.body.ingredients.length; i++) {
        url += req.body.ingredients[i];
        if (i !== req.body.ingredients.length - 1) {
          url += "&";
        }
      }
      console.log(url);
      request(url,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {

            res.json(response);
            return true;
          }
        });
      // ("Optionally") find IDs of food-items s
    } else {
      res.redirect("/");
    }
  });
  return food;
}
