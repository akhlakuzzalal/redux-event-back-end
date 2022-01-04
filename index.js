const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnebi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middleware
app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    const db = client.db("eventManagement");
    const user_collection = db.collection("user");
    const add_service = db.collection("service");

    // add user database

    app.post("/user", async (req, res) => {
      const data = req.body;
      const result = await user_collection.insertOne(data);
      res.json(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await user_collection.deleteOne(filter);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await user_collection.find({}).toArray();
      res.send(result);
    });

    // add to service

    app.post("/service", async (req, res) => {
      const data = req.body;
      const result = await add_service.insertOne(data);
      res.json(result);
    });

    // get to service

    app.get("/service", async (req, res) => {
      const result = await add_service.find({}).toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Event Management Running!");
});

app.listen(port, () => {
  console.log(`listening port: ${port}`);
});
