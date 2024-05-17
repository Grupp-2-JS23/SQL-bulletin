const express = require("express");
const router = express.Router();
const channelController = require("../controllers/channelController");

router.post("/", channelController.createChannel);
router.post("/subscriptions", channelController.createSubscription);

module.exports = router;
