const database = require('../database/db')
const db = database.initDatabase(); 

const channelService = {

    addChannel : async (channelName, ownerId) => {
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
      },

      addSubscription : async (userId, channelId) => {
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
      },

    
 isUserAndChannel : async (userId, channelId) => {
  const checkUser = `SELECT * FROM users WHERE userId = ?`;
  const checkChannel = `SELECT * FROM channels WHERE channelId = ?`;
  
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
},

}

module.exports = channelService;