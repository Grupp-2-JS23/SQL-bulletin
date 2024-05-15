require("dotenv").config();
const database = require("./database/db");
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const URL = process.env.BASE_URL;

app.listen(PORT, URL, () => {
  console.log(`running at http://${URL}:${PORT} or http://localhost:${PORT}`);
});

const db = database.initDatabase;

