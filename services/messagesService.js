const database = require('../database/db')
const db = database.initDatabase(); 

const messagesService = {

    isUserSubscriber : async (sender, channelIds) => {
        return new Promise((res, rej) => {
              // placeholders and values for the SQL query
              const placeholders = channelIds.map(() => "(?, ?)").join(", ");
              const values = channelIds.flatMap(channelId => [sender, channelId]);
        
              const query = `
              SELECT COUNT(*) as count FROM subscriptions
              WHERE (userId, channelId) IN (${placeholders})
              `;
        
               db.get(query, values, (err, row) => {
                if (err) {
                  console.error('Error executing SQL query:', err);
                  rej(err);
                  return;
                }
                console.log('Rows:', row);
                if (row.count !== channelIds.length ) {
                  console.error(`user is not subscribed on one or more channels`);
                  res(false)
                  return;
                }
                res(true);
                   
      })})
      },

      addMessage : async (message, sender, channelIds) => {
        return new Promise((res, rej) => {
          db.serialize(() => {
      
      
              // Insert the message into the messages table
              db.run(
                "INSERT INTO messages (message, sender) VALUES (?, ?)",
                [message, sender],
                function (error) {
                  if (error) {
                    rej(error);
                    return;
                  }
      
                  const messageId = this.lastID;
      
                  // Insert entries into the channelmessages table
                  const insertChannelMessages = channelIds.map((channelId) => {
                    return new Promise((resolve, reject) => {
                      db.run(
                        "INSERT INTO channelmessages (messageId, channelId) VALUES (?, ?)",
                        [messageId, channelId],
                        (error) => {
                          if (error) {
                            reject(error);
                          } else {
                            resolve();
                          }
                        }
                      );
                    });
                  });
      
                  Promise.all(insertChannelMessages)
                    .then(() => res({ messageId: messageId }))
                    .catch((error) => rej(error));
                }
              );
            }
            );
          });
        },

        sortedMessages : async () => {
            return new Promise((res, rej) => {
              const query = `
                    SELECT message, createdAt FROM messages ORDER by createdAt DESC
                    `;
            
              db.all(query, [], (err, rows) => {
                if (err) {
                  console.error(err.message);
                  rej(err);
                } else {
                  console.log("rows",rows);
                    res(rows);
                }           
            });
            })
            }
    
}

module.exports = messagesService;