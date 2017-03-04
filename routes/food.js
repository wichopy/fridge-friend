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

  // Recipe button is clicked, places all elements in a str.
  food.post("/recipes", (req, res) => {
    if (req.session.user_id) {
      console.log(req.body);
      res.status(200);
    } else {
      res.redirect("/");
    }
  });
  return food;
}