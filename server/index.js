"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");

//calling all handler functions to be used with endpoints
const {
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
} = require("./handlers");
express()
  .use(morgan("tiny"))
  .use(express.json())
  //get the object collection from the museum
  .get("/collection", getCollection)
  // get single object from the museum collection based on it's object id
  .get("/collection/:id", getSingleObject)
  //get the comments section for my gallery
  .get("/comments", getComments)
  //get the collection of favorited objects
  .get("/mycollection/:id", getMyCollection)

  //this add's objects to the favorite collection
  .patch("/mycollection/:id", addToCollection)
  // updated the intro section
  .patch("/intro/:id", updateIntro)

  // add comments to the comment section
  .post("/comments", postComments)
  //this will create a collection for the user 
  .post("/collection", createCollection)

  // delete a comment based on it's id
  .delete("/comments/:id", deleteComment)
  // delete a single object from the favorite collection
  .delete("/mycollection/:id/:objectId", deleteSingleObject)
  // this deletes all objects from the collection
  .delete("/mycollection/:id", deleteWholeCollection)

  // a catch for any misdirected pages
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  .listen(8000, () => console.log(`Listening on port 8000`));
