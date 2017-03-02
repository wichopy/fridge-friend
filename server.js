"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const sessionRoutes = require("./routes/session");
const foodRoutes = require("./routes/food");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

//method override must come after body parser or else no worky.
app.use(methodOverride());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    console.log('inside method override.');
    console.log(req.body);
    delete req.body._method;
    return method;
  }
}));

app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
/*
GET /api/users   ->  Grab all users
*/
app.use("/users", usersRoutes(knex));
/*
POST /users/new  -> Register new user
*/
app.use("/food", foodRoutes(knex));
/*
GET /food   --> Display grocery/tracking lists.
*/
app.use("/session", sessionRoutes(knex, foodRoutes));
/*
GET /session -> Render login page.
POST /session  -> Post user credentials for login
DELETE /session  -> Logout of current session
*/


// Home page
app.get("/", (req, res) => {
  //If cookie exists, go directly to food lists.
  if (req.session.user_id) {
    res.redirect("/food");
  }
  //if no cookies detected, go to register/login splash page.
  res.render("index");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});