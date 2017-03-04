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
   /* 1. WARNING: Single entries from front-end result in a string element, multiple entries result in an array element for key:foodItem
    * 2. If logged in:
    * 3. Loop through each item doing the following:
    * 4. Goes through the below only if there is a food-item/food-qty:
    * 5. var function appendIng: appends an item to list "ingredients" if it does not exist (via knex query)
    * 6. var function appendInv: obtains current item's count to itemTotal
    * 6a. ELSE, creates a new entry, adds userId(userId), ingId(ingIndex), pend(food-qty), and inventory (0).
    * 7. promise.all (appendIng,appendInv)
    * 8. Does not complete as intended, as insert commands don't succeed in either row [/tableflip]
    * 9. Upgrade permission issue??
    */

    let userId = req.session.user_id;
    let foodItem = req.body["food-item"];
    let foodQty = req.body["food-qty"];
    if (userId) {
      for (let index in foodItem){
        let curFood = foodItem[index];
        if (foodItem && foodQty){
          var appendIng = new Promise(() => {
            knex.select("*")
              .from("ingredients")
              .where({name: curFood})
              .then((results) => {
                if (!results[0]){ // checks if there is no results from the search, then it appends to ing
                  knex.insert({name: curFood}).into("ingredients");
                }  
              });
          });
          
          var appendInv = new Promise((resolve,reject) => {
            knex.select("userId")
            .from("inventory")
            .where({ingId: ingIndex})
            .then ((results) => {            
              if (let userId in results){
                let invTotal = 0;
                knex.select("pend")
                  .from("inventory")
                  .where({
                    ingId: ingIndex,
                    userId: userId
                  })
                  .then ((results) => {
                    invTotal = results[0] + foodQty[index];
                  })

                knex('inventory')
                  .where({
                    id: userId
                  }) 
                  .update({
                    pend: invTotal
                  });

              } else {
                knex("ingredients").insert({
                  userId: userId,
                  ingId: ingIndex,
                  pend: foodQty[index],
                  qty: 0
                }); // knex insert
              } // else statement
            }); // .then
          }); // Promise, end.
        } // if item+qty is food, ends.
        Promise.all([appendIng, appendInv]).then().catch();
      } // for loop cycling each submitted item
    } else {
      res.redirect("/");
    }
  });

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

    } else {
      res.redirect("/");
    }
  });
  return food;
}