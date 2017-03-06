const express = require('express');
const router = express.Router();

module.exports = () => {
  // Home page
  router.get("/", (req, res) => {
    //If cookie exists, go directly to food lists.
    // req.session = null;
    if (req.session.user_id) {
      res.redirect("/food");
      return;
    }
    //if no cookies detected, go to register/login splash page.
    res.render("index");
  });
  return router;

}