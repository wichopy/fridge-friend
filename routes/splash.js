const express = require('express');
const router = express.Router();

module.exports = () => {
  // Home page
  router.get("/", (req, res) => {
    //If cookie exists, go directly to food lists.
    if (req.session.user_id) {
      res.redirect("/food");
    }
    //if no cookies detected, go to register/login splash page.
    res.render("index");
  });
  return router;

}