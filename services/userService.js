const database = require('../database/db')
const db = database.initDatabase(); 
const addUser = async (userName, email ) => {
    return new Promise((res, rej) => {
      db.run(
        "INSERT INTO users (userName, email) VALUES (?, ?)",
        [userName, email],
        function (error) {
          if (error) {
            console.error(error);
            rej(error);
          } else {
            res({ userId: this.lastID });
          }
        }
      );
    });
  };

  module.exports = { addUser }