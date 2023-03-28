"use strict";
const { MongoClient } = require("mongodb");

require("dotenv").config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = {};
