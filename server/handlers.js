"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config({ path: "../.env" });


const MONGO_URI = process.env.MONGO_URI;
const MUSEUM_KEY = process.env.MUSEUM_API_KEY;
const { v4: uuidv4 } = require("uuid");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getCollection = async (request, response) => {
  try {
    const { p, q, type } = request.query;
    let endpoint = `https://www.rijksmuseum.nl/api/en/collection?key=${MUSEUM_KEY}&p=${p}&ps=20`;
    if (q) {
      endpoint = `https://www.rijksmuseum.nl/api/en/collection?key=${MUSEUM_KEY}&q=${q}&p=${p}&ps=20`;
    }
    if (type) {
      endpoint = `https://www.rijksmuseum.nl/api/en/collection?key=${MUSEUM_KEY}&type=${type}&p=${p}&ps=20`;
    }

    if (q && type) {
      endpoint = `https://www.rijksmuseum.nl/api/en/collection?key=${MUSEUM_KEY}&q=${q}&type=${type}&p=${p}&ps=20`;
    }
    console.log(request.query);
    const fetch = await import('node-fetch');
    const result = await fetch.default(endpoint);
    const data = await result.json();
    return response.status(200).json({ status: 200, data });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};

const getComments = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Website_Db");
  try {
    await client.connect();
    const comments = await db.collection("comments").find().toArray();

    comments
      ? response.status(200).json({
          status: 200,
          data: comments,
          message: "Found the comments",
        })
      : response
          .status(404)
          .json({ status: 404, data: comments, message: "No comments Found" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

const postComments = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Website_Db");
  const { comment, imageSrc, user } = request.body;

  try {
    const newComment = await db
      .collection("comments")
      .insertOne({ _id: uuidv4(), comment, imageSrc, user });
    return response.status(200).json({
      status: 200,
      message: "Your comment was added",
      data: newComment,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

const deleteComment = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Website_Db");
  const id = request.params.id;

  try {
    const comment = await db.collection("comments").deleteOne({ _id: id });
    if (comment.deletedCount > 0) {
      response.status(204).json({ message: "Your comment was deleted" });
    } else {
      response.status(404).json({ message: "Comment not deleted" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};
module.exports = { getCollection, getComments, postComments, deleteComment };
