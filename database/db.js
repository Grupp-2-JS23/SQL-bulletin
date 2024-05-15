const sqlite = require("sqlite3").verbose();

const initDatabase = () => {
  const db = new sqlite.Database("./database/database.db", (error) => {
    if (error) {
      console.error("Error opening database:", error.message);
    } else {
      console.log("Connected to the SQLite database");
    }
  });

  return db;
};

module.exports = { initDatabase };
