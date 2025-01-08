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
    console.log("Connected to MongoDB successfully Topic: Robots");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

// Connect to MongoDB at server start
connectToDb();

// Endpoint to list all robots
app.get("/robot", async (req, res) => {
  try {
    const query = {};
    const results = await db
      .collection("robot")
      .find(query)
      .limit(100)
      .toArray();
    console.log(results);

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching robots:", err);
    res.status(500).send({ err: "Failed to fetch robots." });
  }
});

app.get("/robot/:id", async (req, res) => {
  try {
    const robotId = Number(req.params.id);
    console.log("Robot found:", robotId);

    const query = { id: robotId };
    const result = await db.collection("robot").findOne(query);
    console.log("Result:", result);

    if (!result) {
      res.status(404).send({ err: "Not Found" });
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error("Error fetching robot by ID:", err);
    res.status(500).send({ err: "Failed to fetch robot by ID." });
  }
});

app.post("/robot", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Bad request: No data provided." });
    }

    const newDocument = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    };

    await client.connect();
    // const db = client.db("robot"); // replace with your actual database name

    // Check if a document with the same ID already exists
    const existingDoc = await db
      .collection("robot")
      .findOne({ id: newDocument.id });
    if (existingDoc) {
      return res
        .status(409)
        .send({ error: "Conflict: A robot with this ID already exists." });
    }

    // Insert the new document
    const results = await db.collection("robot").insertOne(newDocument);

    res.status(200).send(newDocument);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  } finally {
    await client.close();
  }
});

app.delete("/robot/:id", async (req, res) => {
  try {
    // read Param
    const id = Number(req.params.id);
    // connect to Mongodb
    await client.connect();
    console.log("Robot to delete :", id);
    // query to delet only one robot with id
    const query = { id: id };
    // read data from robot to delete to send to frontend
    const robotDeleted = await db.collection("robot").findOne(query);
    if (!robotDeleted) {
      return res
        .status(409)
        .send({ error: "Conflict: A robot with this ID does NOT exists." });
    }
    // delete
    const results = await db.collection("robot").deleteOne(query);
    // response to client
    res.status(200);
    res.send(robotDeleted);
  } catch (error) {
    console.error("Error deleting robot:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.put("/robot/:id", async (req, res) => {
  try {
    // read Param
    const id = Number(req.params.id);
    // connect to Mongodb
    await client.connect();
    console.log("Robot to Update :", id);
    // query to update only one robot with id
    const query = { id: id };
    // read data from robot to update to send to frontend
    const robotUpdated = await db.collection("robot").findOne(query);
    if (!robotUpdated) {
      return res
        .status(409)
        .send({ error: "Conflict: A robot with this ID does NOT exists." });
    }
    // Data for updating the document, typically comes from the request body
    const updateData = {
      $set: {
        id: id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
      },
    };

    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = {};
    // Update
    const results = await db
      .collection("robot")
      .updateOne(query, updateData, options);
    console.log(results);
    // If no document was found to update, you can choose to handle it by sending a 404 response
    if (results.matchedCount === 0) {
      return res.status(404).send({ message: "Robot not found" });
    } else {
      // read data from robot, updated robot
      const robotUpdated = await db.collection("robot").findOne(query);
      // Response to client
      res.status(200);
      res.send(robotUpdated);
    }
  } catch (error) {
    console.error("Error Updating robot:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://${host}:${port}`);
});
