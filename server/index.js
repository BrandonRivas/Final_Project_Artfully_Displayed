"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");

const { getCollection } = require("./handlers");
express()
  .use(morgan("tiny"))
  .use(express.json())
  .get("/home", getCollection)

  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  .listen(3000, () => console.log(`Listening on port 3000`));
