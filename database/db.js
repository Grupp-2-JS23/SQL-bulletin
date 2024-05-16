//Inloggnings endpoint
//Sortering, meddelande, datum
//POST username, password
//POST user login
//POST channel
//GET chanel (se meddelanden)
//POST subscribe
//POST message

const sqlite = require("sqlite3").verbose();
const fs = require("fs");
const path = "../database/database.db";

let dbInstance = null;

const initDatabase = () => {
  if (dbInstance) {
    return dbInstance;
  }

  if (fs.existsSync(path)) {
    dbInstance = new sqlite.Database(path);
    return dbInstance;
  }

  dbInstance = new sqlite.Database("./database/database.db", (error) => {
    if (error) {
      console.error("Error opening database:", error.message);
    } else {
      console.log("Connected to the SQLite database");
    }
  });

  const createTable = (name, sql_text) => {
    dbInstance.get(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name= ? `,
      [name],
      (err, row) => {
        if (err) {
          console.error(err);
          return;
        }
        if (!row) {
          dbInstance.run(`${sql_text}`, (err) => {
            if (err) {
              console.error("error creating table 😒", err);
            } else {
              console.log(`table ${name} created 😎`);
            }
          });
        } else {
          console.log(`table ${name} already exists 👍`);
        }
      }
    );
  };

  const sql_user = `CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY,
    userName VARCHAR(20),
    password TEXT
) `;
  const sql_channel = `CREATE TABLE IF NOT EXISTS channels (
    channelId INTEGER PRIMARY KEY,
    channelName VARCHAR(20),
    ownerId INTEGER,
    FOREIGN KEY(ownerId) REFERENCES users(userId)
) `;
  const sql_message = `CREATE TABLE IF NOT EXISTS messages (
    messageId INTEGER PRIMARY KEY,
    message TEXT,
    createdAt DATE,
    sender INTEGER,
    receiver INTEGER,
    FOREIGN KEY(sender) REFERENCES users(userId)
    
)`;
  const sql_channelmessage = `CREATE TABLE IF NOT EXISTS channelmessages (
  messageId INTEGER, 
  channelId INTEGER, 
  PRIMARY KEY(messageId, channelId),
  FOREIGN KEY(messageId) REFERENCES messages(messageId),
  FOREIGN KEY(channelId) REFERENCES channels(channelId)
)`;
  const sql_subscription = `CREATE TABLE IF NOT EXISTS subscriptions (
  userId INTEGER, channelId INTEGER, 
  PRIMARY KEY(userId, channelId),
  FOREIGN KEY(userId) REFERENCES users(userId),
  FOREIGN KEY(channelId) REFERENCES channels(channelId)
)`;

  dbInstance.serialize(() => {
    createTable("users", sql_user);
    createTable("channels", sql_channel);
    createTable("messages", sql_message);
    createTable("channelmessages", sql_channelmessage);
    createTable("subscriptions", sql_subscription);
  });

  return dbInstance;
};

module.exports = { initDatabase };

/* jag har testat att köra singleton-pattern som vi pratade om innan 
dbInstans är null, innebär det  'här finns det ingen databas anslutning'
sen kör jag en if sats för att kolla om dbinstance inte är null, om en anslutning finns
returnerar jag anslutningen */
