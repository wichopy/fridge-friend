"use strict";
//http://stackoverflow.com/questions/7140074/restfully-design-login-or-register-resources
const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  //log in page
  router.get("/", (req, res) => {
    res.render('login');
  });

  //check credentials.
  router.post("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .where({ name: req.body.name })
      .then((results) => {
        console.log(results);
        res.status(200).send();
      });
  });

  //logout
  router.delete("/", (req, res) => {
    // console.log(req.body.id);
    knex
      .select("*")
      .from("users")
      .where({ id: req.body.id }) //query WHERE ID = req.body.id
      .then((results) => {
        console.log(`Your user is: ${results[0].name}`);
        res.status(200).send();
      });
  });


  return router;
}