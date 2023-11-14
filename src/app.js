const express = require("express");
const app = express();
const consign = require("consign");

app.use(express.json());

consign({ cwd: "src", verbose: false })
  .then("./routes")
  .include("./config/routes.js")
  .into(app);

app.get("/", (req, res) => {
  res.status(200).send();
});

module.exports = app;
