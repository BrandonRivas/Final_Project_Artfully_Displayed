const comments = require("./data/comments.json");

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    console.log("connected");

    const db = client.db("Website_Db");

    await db.collection("comments").insertMany(comments);
    console.log("posted comments");
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
    console.log("Closing Connection");
  }
};

batchImport();
