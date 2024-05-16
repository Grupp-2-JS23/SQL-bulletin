const express = require("express");

const router = express.Router();
const userController = require('../controllers/userController');



router.get("/", (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            console.error("Error executing query: 😶‍🌫️ " + err.message);
        } else{ 
            res.status(200).json(rows)
        }
    })
});

router.put("/", (req, res) => {
});


router.post("/signup", userController.createUser);


router.delete("/", (req, res) => {
});


module.exports = router;

//sign up 
//