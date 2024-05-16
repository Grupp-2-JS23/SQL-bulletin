require("dotenv").config();
const database = require("./database/db");
const express = require("express");
const app = express();
const PORT = process.env.PORT;
const URL = process.env.BASE_URL;
const userRoutes = require("./routes/UserRoutes");
const channelRoutes = require("./routes/ChannelRoutes");
const messageRoutes = require("./routes/MessagesRoutes");
const db = database.initDatabase;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/channels", channelRoutes);
app.use("/messages", messageRoutes);

app.listen(PORT, URL, () => {
  console.log(`running at http://${URL}:${PORT} or http://localhost:${PORT}`);
});
