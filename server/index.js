"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");

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
} = require("./handlers");
express()
  .use(morgan("tiny"))
  .use(express.json())
  .get("/collection", getCollection)
  .get("/collection/:id", getSingleObject)
  .get("/comments", getComments)
  .get("/mycollection/:id", getMyCollection)
  .patch("/mycollection/:id", addToCollection)
  .post("/comments", postComments)
  .post("/collection", createCollection)
  .delete("/comments/:id", deleteComment)
  .delete("/mycollection/:id/:objectId", deleteSingleObject)
  .delete("/mycollection/:id", deleteWholeCollection)

  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  .listen(8000, () => console.log(`Listening on port 8000`));
