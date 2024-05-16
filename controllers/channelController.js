const database = require('../database/db');
const db = database.initDatabase();

const createChannel = async (req, res) => {
    const {channelName, ownerId} = req.body;
    console.log(channelName, ownerId);

    try {
        await addChannel(channelName, ownerId);
        res.status(201).json({ success: true, message: `Channel ${channelName} created and owner is ${ownerId}` });
    } catch (error) {
        console.error("error occured creating channel 🥲", error);
        res.status(500).json({ success: false, message: `${error.message}`});
    }

}

const addChannel = async (channelName, ownerId) => {
    return new Promise((res, rej) => {
    db.run(`INSERT INTO channels (channelName, ownerId) VALUES (?, ?)`,[channelName, ownerId],  function (error) {
        if(error){
            console.error(error);
            rej(error);
        } else {
            res({ channelId: this.lastID });
   }
    })
})
};

module.exports = { createChannel }