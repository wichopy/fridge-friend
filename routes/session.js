"use strict";
//http://stackoverflow.com/questions/7140074/restfully-design-login-or-register-resources
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// const foodRoute = require('./food');



module.exports = (knex) => {

  //log in page
  // router.get("/", (req, res) => {
  //   res.render('login');
  // });

  //check credentials.
  router.post("/", (req, res) => {
    // console.log(`Your login response looks like this: ${req.body.email, req.body.password}`);
    knex
      .select("*")
      .from("users")
      .where({ email: req.body.email })
      .then((results) => {
        // console.log(results[0].password);      
        bcrypt.compare(req.body.password, results[0].password).then((result) => {
          if (result) {
            req.session.user_id = results[0].id;
            res.redirect("/food/");
          } else {
            res.status(401).send("login failed");
          }
        });
      });
  });

  //logout
  router.delete("/", (req, res) => {
    // console.log(req.body.id);
    if (req.session.user_id) {
      req.session = null;
      res.redirect("/");
    } else {
      res.status(403).send("leave me alone");
    }
    // knex
    //   .select("*")
    //   .from("users")
    //   .where({ id: req.body.id }) //query WHERE ID = req.body.id
    //   .then((results) => {
    //     console.log(`Your user is: ${results[0].name}`);
    //     res.status(200).send();
    //   });
  });


  return router;
}