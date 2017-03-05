"use strict";

const express = require('express');
const food = express.Router();

module.exports = (knex, Mailgun) => {
  food.get("/", (req, res) => {
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
      if (curFood && curQty) {
        let appendIng = knex.raw(`INSERT INTO ingredients (name) VALUES (?) ON CONFLICT (name) 
          DO UPDATE SET name = ingredients.name RETURNING ID`, [curFood])
          .then((result)=> {
            
            return knex.raw(`INSERT INTO inventory ("userId", "ingId","pend","qty") VALUES (${userId},${result.rows[0].id},${curQty},0) ON CONFLICT ("userId", "ingId") 
              DO UPDATE SET pend = excluded.pend + inventory.pend`);
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

  // Purchase button is clicked: removes from shopping list and appends under inventory list

  food.post("/inventory", (req, res) => {
    let userId = req.session.user_id;
    if (!userId) {
      return res.redirect("/");
    }

    let curFood = req.body["food-item"];
    knex.select("id").from("ingredients").where({name:curFood})
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
  food.post("/delPend", (req, res) => {
    let userId = req.session.user_id;
    if (!userId) {
      return res.redirect("/");
    }
    let curFood = req.body["food-item"];
    knex.select("id").from("ingredients").where({name:curFood})
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
      knex
        .select("id")
        .from("inventory")
        .where({ 
          pend:0,
          inv:0 
        })
        .then((results) => {
          for (row of results){
            knex('inventory').where({id:row}).del();
          }
        });
    })

    .then(() => {
      res.status(200).send()
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });    
  });

  food.post("/delInv", (req, res) => {
    let userId = req.session.user_id;
    if (!userId) {
      return res.redirect("/");
    }
    let curFood = req.body["food-item"];
    knex.select("id").from("ingredients").where({name:curFood})
    .then((result) => {
      return knex('inventory')
      .where({
          userId: userId,
          ingId: result[0].id
        })
      .update({
        inv: 0
      })
    })
    .then(() => {
      knex
        .select("id")
        .from("inventory")
        .where({ 
          pend:0,
          inv:0 
        })
        .then((results) => {
          for (row of results){
            knex('inventory').where({id:row}).del();
          }
        });
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
    var from_who = 'derp@derp.com';
    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});   
    // user's email, user's shopping list
    
    // going for email+shopping list...
    knex("inventory")
      .join('users', 'userId', 'users.id')
      .join('ingredients', 'ingId', 'ingredients.id')
      .select("users.email", "ingredients.name")
      .where({userId:req.session.user_id, pend: 1})
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
        id: userId,
        pend:1
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
        id: userId,
        qty:1
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
    if (!userId){
      res.redirect("/");
    }
    res.status(200).send();
  });
  return food;
}