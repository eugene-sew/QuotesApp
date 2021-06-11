const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.use(bodyParser.json());

// mongo connection

const uri =
  "mongodb+srv://EugeneDev:EugeneDev@quotes.g6iqw.mongodb.net/QuotesDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) return console.log(err);
  console.log("connected to database succesfully");
  const db = client.db("QuoteCrud");
  const quotesCollection = db.collection("quotesCollection");

  // body parser
  app.use(bodyParser.urlencoded({ extended: true }));
  // Get method
  app.get("/", (req, res) => {
    db.collection("quotesCollection")
      .find()
      .toArray()
      .then((results) => {
        console.log(results);
        res.render("index", { title: "Unheard Quotes", quotes: results });
      })
      .catch((error) => console.log(error));
  });

  // Post method
  app.post("/quotes", (req, res) => {
    console.log("I am a quote");
    var { name, quote } = req.body;
    quotesCollection
      .insertOne(req.body)
      .then((result) => {
        console.log(result);
        res.redirect("/");
      })
      .catch((error) => console.log(error));
    console.log(req.body);
  });

  // update method
  app.put("/quotes", (req, res) => {
    quotesCollection
      .findOneAndUpdate(
        { name: "monday" },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote,
          },
        },
        {
          upsert: true,
        }
      )
      .then((result) => {
        res.json("Success");
      })
      .catch((error) => console.error(error));
  });

  // delete method
  app.delete("/quotes", (req, res) => {
    quotesCollection
      .deleteOne({ name: req.body.name })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res.json("No quote to delete at the moment");
        }
        res.json("Deleted monday's quotes");
      })
      .catch((error) => console.error(error));
  });

  app.listen(3000, () => {
    console.log("Server started");
  });
});
