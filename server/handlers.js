"use strict";
const { MongoClient } = require("mongodb");
const express = require("express");

require("dotenv").config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI;
const MUSEUM_KEY = process.env.MUSEUM_API_KEY;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
express();
const getCollection = (request, response, next) => {
  fetch(`https://www.rijksmuseum.nl/api/en/collection?key=${MUSEUM_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      response.json(data);
    })
    .catch(next);
};
module.exports = { getCollection };
