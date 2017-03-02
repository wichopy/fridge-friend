"use strict";

const express = require('express');
const food = express.Router();

module.exports = (knex) => {

  food.get("/", (req, res) => {
    res.render("food");
    //   knex
    //     .select("*")
    //     .from("users")
    //     .then((results) => {
    //       res.json(results);
    //   });
  });

  return food;
}