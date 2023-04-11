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

// this will fetch the collection of objects from the museum. Based on what's provided, it will fetch different endpoints. 
// the default is to fetch 20 objects at a time. If a query is provided it will search for that query in any of the keys 
// provided by the museum. If the user uses a radio button it will add the type query. It will also fetch based on if 
// a query and type is provided. 
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

//based on an object's id it will fetch the result from the museum's api
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

//this will fetch the comments collection from MongoDB 
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

//This will insert a comment into the comment collection
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

// if the user is new and does not have a collection based on it's id, this will create one
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

//this will fetch the collection for the user based on the provided id
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

//once a user likes an object it will be added to the favorite key
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

// This will update the intro key with the provided values from a textarea 
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

//this will delete a comment from the comments collection based on it's specific id
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

//this will remove a single object from the favorite collection based on the object's id
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

//this update favorite collection to it's default state, an empty array. 
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
