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
    console.log("inside post: shopping");
    console.log(req.body);
    res.status(200).send();

    // if (req.session.user_id) {
    //   knex
    //     .select("*")
    //     .from("inventory")
    //     .where({ userId: req.session.user_id })
    //     .then((results) => {

    //     });
    // } else {
    //   res.redirect("/");
    // }

  });

  // Purchase button is clicked: removes from shopping list and appends under inventory list
  food.post("/inventory", (req, res) => {
    if (req.session.user_id) {
      console.log(req.body);
      res.status(200).send()
    } else {
      res.redirect("/");
    }
  });
  const request = require('request');


  // Recipe button is clicked, places all elements in a str.
  food.post("/recipes", (req, res) => {
    if (req.session.user_id) {
      console.log(req.body);
      request(`http://food2fork.com/api/search?key=a6d38b7fdc69b588f290a8a5ca84f127&q=${req.body.ingredients[0]}&${req.body.ingredients[1]}&${req.body.ingredients[3]}`,
        function (error, response, body) {
          if (!error && response.statusCode == 200) {
            res.json(response);
          }
        });

    } else {
      res.redirect("/");
    }
  });
  return food;
}