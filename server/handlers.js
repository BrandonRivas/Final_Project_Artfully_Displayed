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
const getCollection = async (request, response, next) => {
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
    const result = await fetch(endpoint);
    const data = await result.json();
    return response.status(200).json({ status: 200, data });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error.message });
  }
};
module.exports = { getCollection };
