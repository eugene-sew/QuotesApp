const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/quotes", (req, res) => {
  console.log("I am a quote");
  var { name, quote } = req.body;
  console.log(name, quote);
});

app.listen(3000, () => {
  console.log("Server started");
});

