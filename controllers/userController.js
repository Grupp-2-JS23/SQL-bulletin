const { addUser } = require('../services/userService')

const createUser = async (req, res) => {
  const { userName, email } = req.body ?? {};
  console.log(userName, email);
  try {
    await addUser(userName, email);
    res
      .status(201)
      .json({ success: true, message: `User ${userName} created ` });
  } catch (error) {
    console.error("error occured creating user 🥲", error);
    res.status(500).json({ success: false, message: `${error.message}` });
  }
};


module.exports = { createUser };
