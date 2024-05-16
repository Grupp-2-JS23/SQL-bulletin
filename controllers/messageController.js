const database = require("../database/db");
const db = database.initDatabase();

//messages
// message, userId,

//channelmessage
// channelId, messageId
const createMessage = async (req, res) => {
  const { message, sender, channelIds } = req.body;
  try {
    await addMessage(message, sender, channelIds);
    res.status(201).json({
      success: true,
      message: `message created by ${sender}`,
    });
  } catch (error) {
    console.error("error occured creating message 🥲", error);
    res.status(500).json({ success: false, message: `${error.message}` });
  }
};

const addMessage = async (message, sender, channelIds) => {
  return new Promise((res, rej) => {
    db.run(
      "INSERT INTO messages (message, sender) VALUES (?, ?)",
      [message, sender],
      function (error) {
        if (error) {
          console.error(error);
          rej(error);
        } else {
          const messageId = this.lastID;
          channelIds.forEach((channelId) => {
            //Här håller vi på
            db.get(
              `SELECT * FROM subscriptions WHERE userId = ? AND channelId = ?`,
              [sender, channelId],
              (err, row) => {
                if (err) {
                  rej(err);
                  return;
                }
                if (row) {
                  rej(new Error("subscriptions already exists!"));
                  return;
                }
                db.run(
                  "INSERT INTO channelmessages (messageId, channelId) VALUES (?, ?)",
                  [messageId, channelId],
                  function (error) {
                    if (error) {
                      console.error(error);
                      rej(error);
                    }
                  }
                );
              }
            );
            res({ messageId: messageId });
          });
        }
      }
    );
  });
};

module.exports = { createMessage };

//
// {
//   "channelID":[
//     "1",
//     "2",
//     "5"
//   ],

// }
// channelId.foreach(id) => db.run(" insert into channelmessages(messageid, channelid)")
