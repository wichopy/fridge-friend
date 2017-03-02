"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  //Grab all the users
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
      });
  });
  //Register
  router.post("/new", (req, res) => {
    console.log(req.body.name);
    knex
      .select("*")
      .from("users")
      .where({ name: req.body.name })
      .then((results) => {
        console.log(results);
        res.status(200).send();
      });
  });

  return router;
}