//Inloggnings endpoint
//Sortering, meddelande, datum
//POST username, password
//POST user login
//POST channel
//GET chanel (se meddelanden)
//POST subscribe
//POST message

const sqlite = require("sqlite3").verbose();

const initDatabase = () => {
  const db = new sqlite.Database("./database/database.db", (error) => {
    if (error) {
      console.error("Error opening database:", error.message);
    } else {
      console.log("Connected to the SQLite database");
    }
    
  });
  const createTable = (name, sql_text) => {
  
    db.get(`SELECT name FROM sqlite_master WHERE type = 'table' AND name= ? `,[name] ,(err, row) => {
      if (err){
        console.error(err);
        return;
      }
      if (!row){
        db.run(`${sql_text}`, (err) => {
          if(err) { 
            console.error('error creating table 😒', err);
        } else {
          console.log(`table ${name} created 😎`);
        }
        })
      } else {
        console.log(`table ${name} already exists 👍`);
      };
  
  })
  } 
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
    FOREIGN KEY(sender) REFERENCES users(userId),
    FOREIGN KEY(receiver) REFERENCES channels(channelId)
)`;
const sql_subscription = `CREATE TABLE IF NOT EXISTS subscriptions (
  userId INTEGER, channelId INTEGER, 
  PRIMARY KEY(userId, channelId),
  FOREIGN KEY(userId) REFERENCES users(userId),
  FOREIGN KEY(channelId) REFERENCES channels(channelId))`;

  db.serialize(() => {
    createTable('users', sql_user);
    createTable('channels', sql_channel);
    createTable('messages', sql_message);
    createTable('subscriptions', sql_subscription);
  });
  return db;
};


module.exports = { initDatabase };


