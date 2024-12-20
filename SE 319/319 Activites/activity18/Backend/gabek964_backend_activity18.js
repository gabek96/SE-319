var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var { MongoClient } = require("mongodb");

var app = express();
app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

// MongoDB setup
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms319";
const client = new MongoClient(url);
let db;

async function connectToDb() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

// Connect to MongoDB at server start
connectToDb();

app.get("/listMovies", async (req, res) => {
  try {
    const query = {};
    const results = await db.collection("movie").find(query).limit(100).toArray();
    console.log(results);

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Failed to fetch movies.");
  }
});

app.get("/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    console.log("Movie to find:", movieId);

    const query = { movieId: movieId };
    const result = await db.collection("movie").findOne(query);
    console.log("Result:", result);

    if (!result) {
      res.status(404).send("Not Found");
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("Error fetching movie by ID:", err);
    res.status(500).send("Failed to fetch movie by ID.");
  }
});

app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`);
});
