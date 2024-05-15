const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    db.all("SELECT * FROM subscriptions", (err, rows) => {
        if(err) {
            console.error("Error fetching subscriptions:" , err.message);
            res.status(500).json({ error: "Error fetching subscriptions" });
        } else { 
            res.status(200).json(rows)
        }
    });
});

router.post("/", (req, res) => {
    
});

router.delete("/", (req, res) => {
});


module.exports = router;

//post på createchannel lägg till userID i req.body knyta id från ägare till channel 

