"use strict";

const express = require('express');
const food = express.Router();

module.exports = (knex) => {
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
    //   knex
    //     .select("*")
    //     .from("users")
    //     .then((results) => {
    //       res.json(results);
    //   });
  });

  food.post("/shopping", (req, res) => {
  // returns input req.body as: {"food-item":['a', 'abc'], "foodQty": [1,2]"}

    let curFood = req.body["food-item"];
    let curQty = req.body["food-qty"];
    let userId = req.session.user_id;
    let queries = [];
    if (!userId) {
      return res.redirect("/");
    }    
      if (curFood && curQty) {
        let appendIng = knex.raw(`INSERT INTO ingredients (name) VALUES (?) ON CONFLICT (name) 
          DO UPDATE SET name = ingredients.name RETURNING ID`, [curFood])
          .then((result)=> {
            console.log(`ingId = ${JSON.stringify(result)}`);
            return knex.raw(`INSERT INTO inventory ("userId", "ingId","pend","qty") VALUES (${userId},${result.rows[0].id},${curQty},0) ON CONFLICT ("userId", "ingId") 
              DO UPDATE SET pend = excluded.pend + inventory.pend`);
          });
        queries.push(appendIng);  
      } // if item+qty is food, ends.
    // } // for loop cycling each submitted item
    
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
    if (req.session.user_id) {
      console.log(req.body);
      let foodItem = req.body["food-item"];

      for (let index in foodItem){
        var pendCount = 0;
        knex
          .select("pend")
          .from ("inventory")
          .innerJoin("ingredients", 'inventory.ingId', 'ingredients.id')
          .where({name: curFood})
          .then((results) =>{
            pendCount = results[0];
          });

        knex
          .select("*")
          .from ("inventory")
          .innerJoin("ingredients", 'inventory.ingId', 'ingredients.id')
          .where({name: curFood})
          .update({
            pend: 0,
            total: pendCount
          });
      }
      res.status(200).send()
    } else {
      res.redirect("/");
    }
  });

  // Recipe button is clicked, places all elements in a str.
  food.post("/recipes", (req, res) => {
    if (req.session.user_id) {
    // ("Optionally") find IDs of food-items s
    } else {
      res.redirect("/");
    }
  });
  return food;
}