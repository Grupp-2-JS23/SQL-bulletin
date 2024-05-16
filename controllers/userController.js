const database = require("../database/db");
const db = database.initDatabase();

const createUser = async (req, res) => {
  const { userName, password } = req.body ?? {};
  console.log(userName, password);
  try {
    await addUser(userName, password);
    res
      .status(201)
      .json({ success: true, message: `User ${userName} created ` });
  } catch (error) {
    console.error("error occured creating user 🥲", error);
    res.status(500).json({ success: false, message: `${error.message}` });
  }
};
const addUser = async (userName, password) => {
  return new Promise((res, rej) => {
    db.run(
      "INSERT INTO users (userName, password) VALUES (?, ?)",
      [userName, password],
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

module.exports = { createUser };
