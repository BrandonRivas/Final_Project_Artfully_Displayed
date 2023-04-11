"use strict";
const { response } = require("express");
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
    const fetch = await import("node-fetch");
    const result = await fetch.default(endpoint);
    const data = await result.json();
    return response.status(200).json({ status: 200, data });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};

const getSingleObject = async (request, response) => {
  const objectId = request.params.id;
  try {
    const fetch = await import("node-fetch");
    const result = await fetch.default(
      `https://www.rijksmuseum.nl/api/en/collection/${objectId}?key=${MUSEUM_KEY}`
    );
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

const createCollection = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Website_Db");
  const { _id, favorite, intro } = request.body;
  try {
    const existingExhibit = await db.collection("exhibit").findOne({ _id });
    if (existingExhibit) {
      return response.status(406).json({
        status: 406,
        message: "You've already created an exhibit",
      });
    }

    const newExhibit = await db
      .collection("exhibit")
      .insertOne({ _id, favorite, intro });
    return response.status(200).json({
      status: 200,
      message: "Your exhibit has been created",
      data: newExhibit,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

const getMyCollection = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Website_Db");
  const { id } = request.params;
  try {
    const myCollection = await db
      .collection("exhibit")
      .find({ _id: id })
      .toArray();
    if (myCollection.length === 0) {
      response.status(204).json({
        status: 204,
        data: null,
        message: "It appears you don't have a collection",
      });
    } else {
      response.status(200).json({
        status: 200,
        data: myCollection,
        message: "Found your collection",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

const addToCollection = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Website_Db");
  const { id } = request.params;
  const { favorite } = request.body;
  try {
    const result = await db
      .collection("exhibit")
      .updateOne({ _id: id }, { $push: { favorite: favorite } });
    if (result.matchedCount === 0) {
      response.status(404).json({
        status: 404,
        data: result,
        message: "Your Collection was not found",
      });
    } else {
      response.status(200).json({
        status: 200,
        data: result,
        message: "Favorite added to collection",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

const updateIntro = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Website_Db");
  const { id } = request.params;
  const { intro } = request.body;
  try {
    const result = await db
      .collection("exhibit")
      .updateOne({ _id: id }, { $set: { intro } });
    if (result.matchedCount === 0) {
      response.status(404).json({
        status: 404,
        data: result,
        message: "Your Collection was not found",
      });
    } else {
      response.status(200).json({
        status: 200,
        data: result,
        message: "Your intro was updated ",
      });
    }
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

const deleteSingleObject = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Website_Db");
  const { id, objectId } = request.params;
  try {
    const result = await db
      .collection("exhibit")
      .updateOne({ _id: id }, { $pull: { favorite: { id: objectId } } });
    if (result.matchedCount === 0) {
      response.status(404).json({
        status: 404,
        data: result,
        message: "Your Collection was not found",
      });
    } else {
      response.status(200).json({
        status: 200,
        data: result,
        message: "Favorite was deleted from the collection",
      });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};
const deleteWholeCollection = async (request, response) => {
  const client = new MongoClient(MONGO_URI, options);
  const db = client.db("Website_Db");
  const { id } = request.params;
  try {
    const result = await db
      .collection("exhibit")
      .updateOne({ _id: id }, { $set: { favorite: [] } });
    if (result.modifiedCount > 0) {
      response.status(200).json({
        status: 200,
        message: "You've deleted the whole collection",
      });
    } else {
      response
        .status(404)
        .json({ message: "Could not delete your collection" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
};

module.exports = {
  getCollection,
  getSingleObject,
  getComments,
  postComments,
  deleteComment,
  createCollection,
  getMyCollection,
  addToCollection,
  deleteSingleObject,
  deleteWholeCollection,
  updateIntro,
};
