const database = require("../database/db");
const db = database.initDatabase();

const createChannel = async (req, res) => {
  const { channelName, ownerId } = req.body;
  console.log(channelName, ownerId);

  try {
    await addChannel(channelName, ownerId);
    res.status(201).json({
      success: true,
      message: `Channel ${channelName} created and owner is ${ownerId}`,
    });
  } catch (error) {
    console.error("error occured creating channel 🥲", error);
    res.status(500).json({ success: false, message: `${error.message}` });
  }
};

const addChannel = async (channelName, ownerId) => {
  return new Promise((res, rej) => {
    db.run(
      `INSERT INTO channels (channelName, ownerId) VALUES (?, ?)`,
      [channelName, ownerId],
      function (error) {
        if (error) {
          console.error(error);
          rej(error);
        } else {
          res({ channelId: this.lastID });
        }
      }
    );
  });
};

const createSubscription = async (req, res) => {
  const { userId, channelId } = req.body;
  console.log(req.body);

  const validUserAndChannel = await isUserAndChannel(userId, channelId);
  console.log("validuser", validUserAndChannel);
  console.log("userid, channelid", userId, channelId);
  if (!validUserAndChannel)
    return res.status(404).json({ success: false, message: `Bad request!!!!` });
  try {
    await addSubscription(userId, channelId);
    res
      .status(201)
      .json({ success: true, message: `Subscribe to channel ${channelId} 😎` });
  } catch (error) {
    console.error("error occured creating subscription 🥲", error);
    res.status(500).json({ success: false, message: `${error.message}` });
  }
};

const addSubscription = async (userId, channelId) => {
  return new Promise((res, rej) => {
    db.get(
      `SELECT * FROM subscriptions WHERE userId = ? AND channelId = ?`,
      [userId, channelId],
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
          `INSERT INTO subscriptions (userId, channelId) VALUES (?, ?)`,
          [userId, channelId],
          function (error) {
            if (error) {
              console.error(error);
              rej(error);
            } else {
              res({ userId: this.lastID, channelId: this.lastID });
            }
          }
        );
      }
    );
  });
};

const checkUser = `SELECT * FROM users WHERE userId = ?`;
const checkChannel = `SELECT * FROM channels WHERE channelId = ?`;

const isUserAndChannel = async (userId, channelId) => {
  return new Promise((res, rej) => {
    db.serialize(() => {
      db.get(checkUser, [userId], (err, userRow) => {
        if (err) {
          rej(err);
          return;
        }
        if (!userRow) {
          res(false);
          return;
        }
      });
      db.get(checkChannel, [channelId], (err, userRow) => {
        if (err) {
          rej(err);
          return;
        }
        if (!userRow) {
          res(false);
          return;
        }
        res(true);
      });
    });
  });
};

module.exports = { createChannel, createSubscription };
