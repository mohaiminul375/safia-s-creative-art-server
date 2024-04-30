const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
// middleware
const corsOption = {
  origin: ["http://localhost:5173","https://safias-art-and-craft.web.app"],
  Credential: true,
  optionSuccessStatus: 200,
};
app.use(cors());  
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixszr3u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    const itemCollection = client.db("art&craftBD").collection("items");
    const categories = client.db("art&craftBD").collection("categories");

    // get
    app.get("/allArt&Crafts", async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const cursor = categories.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data by id
    app.get("/Art&Crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.findOne(query);
      res.send(result);
    });
    // data get by category
    app.get("/AllArt&Crafts/:category", async (req, res) => {
      const category = req.params.category;
      const query = { subcategory_Name: category };
      const cursor = itemCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get data only user
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const cursor = itemCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get data by userName and customization
    app.get("/user/:email/:customization", async (req, res) => {
      const email = req.params.email;
      const getCustomization = req.params.customization;
      console.log("customization", getCustomization);
      const query = { userEmail: email, customization: getCustomization };
      const cursor = itemCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // post
    app.post("/allArt&Crafts", async (req, res) => {
      console.log(req.body);
      const item = req.body;
      const result = await itemCollection.insertOne(item);
      res.send(result);
    });

    // put
    app.put("/Art&Crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateArtCraft = req.body;
      const artCraft = {
        $set: {
          item_name: updateArtCraft.item_name,
          customization: updateArtCraft.customization,
          subcategory_Name: updateArtCraft.subcategory_Name,
          photo: updateArtCraft.photo,
          price: updateArtCraft.price,
          rating: updateArtCraft.rating,
          stockStatus: updateArtCraft.stockStatus,
          description: updateArtCraft.description,
          processing_time: updateArtCraft.processing_time,
        },
      };
      const result = await itemCollection.updateOne(query, artCraft, option);
      res.send(result);
    });

    // delete
    app.delete("/Art&Crafts/:id", async (req, res) => {
      const id = req.params.id;
      console.log("response delete", id);
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });
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

// testing is it working
app.get("/", (req, res) => {
  res.send("creative-art-server is running");
});

app.listen(port, () => {
  console.log(`creative-art server running on port:${port}`);
});
