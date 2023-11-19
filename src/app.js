const express = require("express");
const app = express();
const consign = require("consign");
const knex = require("knex");
const knexfile = require('../knexfile.js');
const knexLogger = require('knex-logger');

app.use(express.json());

// TODO: criar chaveamento dinamico.
app.db = knex(knexfile.test);

app.use(knexLogger(app.db));

consign({ cwd: "src", verbose: false })
  .include("./routes")
  .then("./config/routes.js")
  .into(app);

app.get("/", (req, res) => {
  res.status(200).send();
});

module.exports = app;
