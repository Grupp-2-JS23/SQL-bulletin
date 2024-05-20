const channelService = require("../services/channelService");

//asynchronous function to handle POST request to create channel a channel with channelName and ownerId
const createChannel = async (req, res) => {
  const { channelName, ownerId } = req.body;
  console.log(channelName, ownerId);

  try {
    await channelService.addChannel(channelName, ownerId);
    res.status(201).json({
      success: true,
      message: `Channel ${channelName} created and owner is ${ownerId}`,
    });
  } catch (error) {
    console.error("error occured creating channel 🥲", error);
    res.status(500).json({ success: false, message: `${error.message}` });
  }
};

//asynchronous function to handle POST request to create subscription
const createSubscription = async (req, res) => {
  const { userId, channelId } = req.body;
  console.log(req.body);

  const validUserAndChannel = await channelService.isUserAndChannel(
    userId,
    channelId
  );
  console.log("validuser", validUserAndChannel);
  console.log("userid, channelid", userId, channelId);
  if (!validUserAndChannel)
    return res.status(404).json({ success: false, message: `Bad request!!!!` });
  try {
    await channelService.addSubscription(userId, channelId);
    res
      .status(201)
      .json({ success: true, message: `Subscribe to channel ${channelId} 😎` });
  } catch (error) {
    console.error("error occured creating subscription 🥲", error);
    res.status(500).json({ success: false, message: `${error.message}` });
  }
};

module.exports = { createChannel, createSubscription };
