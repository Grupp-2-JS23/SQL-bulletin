const database = require("../database/db");
const db = database.initDatabase();

const createMessage = async (req, res) => {
  const { message, channelId } = req.body;

  db.run(
    "INSERT INTO messages (message, createdAt, channelId) VALUES (?, ?, ? )",
    [message, channelId],
    function (error) {
      if (error) {
        res.status(400).json({ error: error.message });
      }
      res.json({
        message: "Message created successfully",
        messageId: this.lastID,
      });
    }
  );
};
