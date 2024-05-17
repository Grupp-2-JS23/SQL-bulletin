const messagesService = require('../services/messagesService')

const createMessage = async (req, res) => {
  const { message, sender, channelIds } = req.body;
  try {
    const validSubscriber = await messagesService.isUserSubscriber(sender, channelIds)
    if (!validSubscriber) {
      res.status(404).json({ success: false, message: `User not subscriber on one or more channels ` });
      return
    }
    await messagesService.addMessage(message, sender, channelIds);
    res.status(201).json({
      success: true,
      message: `message created by ${sender}`,
    });

  } catch (error) {
    console.error("error occured creating message 🥲", error);
    res.status(500).json({ success: false, message: `${error.message}` });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await messagesService.sortedMessages()

    console.log("messages------:", messages);

    res.status(200).json({ sucess: true, messages })

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: `${error.message}` })
  }
}

module.exports = { createMessage, getMessages };

