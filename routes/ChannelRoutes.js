const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");


router.post("/", channelController.createChannel);

router.post("/subscriptions", channelController.createSubscription);

/* router.delete("/", (req, res) => {
}); */

module.exports = router;

//post på createchannel lägg till userID i req.body knyta id från ägare till channel
