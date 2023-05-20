const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxalyfy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carCollection = client.db("sportscar").collection("cars");
    app.get("/test", (req, res) => {
      res.send("All is well");
    });

    //   Insert a toy to DB
    app.post("/addtoy", async (req, res) => {
      const data = req.body;
      const result = await carCollection.insertOne(data);
      res.send(result);
    });

    //   Get all toys
    app.get("/alltoy", async (req, res) => {
      const cars = carCollection.find();
      const result = await cars.toArray();
      res.send(result);
    });

    //   get a specific toy and update
    app.patch("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const updatedToyData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          ...updatedToyData,
        },
      };
      const result = await carCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    //   Delete a specific toy
    app.delete("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await carCollection.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Sports car server is running");
});

app.listen(port, () => {
  console.log(`Sports car server is running on port: ${port}`);
});
