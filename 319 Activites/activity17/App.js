var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");

var app = express();
app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

app.get("/", (req, res) => {
  res.status(200);
  res.send(
    "<h1 style='color:Green;background-color: black;border: 0px; '>Hello World From Node </h1>"
  );
});

app.get("/name", () => {
  res.send("My name is Gabriel Kiveu");
});

app.get("/person", (req, res) => {
  const person = {
    name: "alex",
    email: "alex@mail.com",
    job: "software dev",
  };
  console.log(person);
  res.status(200);
  res.send(person);
});

app.get("/listRobots", (req, res) => {
  fs.readFile(__dirname + "/" + "robots.json", "utf8", (err, data) => {
    console.log(data);
    res.status(200);
    res.send(data);
  });
});
