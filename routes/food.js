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
            name: results[0].name
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

  return food;
}