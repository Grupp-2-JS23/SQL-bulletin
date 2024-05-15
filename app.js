require("dotenv").config();
const database = require("./database/db");
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const URL = process.env.BASE_URL;
const userRoutes = require("./routes/UserRoutes");
const channelRoutes = require("./routes/ChannelRoutes");
// const messageRoutes = require("./routes/MessageRoutes");
const db = database.initDatabase;

app.use(express.json());

app.use("/user", userRoutes);
app.use("/channel", channelRoutes);
// app.use("/message", messageRoutes);



app.listen(PORT, URL, () => {
  console.log(`running at http://${URL}:${PORT} or http://localhost:${PORT}`);
});



