const connection = require("../db");
const moment = require("moment");
module.exports.getMessages = async (req, res, next) => {
  try {
    let { from, to } = req.body;
    from = JSON.parse(from);
    to = JSON.parse(from);
    connection.query(
      "SELECT * FROM messages WHERE (to_user_id = ? AND from_user_id = ? ) OR ( to_user_id = ? AND from_user_id = ? ) ORDER BY timestamp ASC",
      [to, from, from, to],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error retrieving messages from database");
        } else {
          res.status(200).json(results);
        }
      }
    );
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
    // Insert the message into the database
    connection.query(
      "INSERT INTO messages (from_user_id, to_user_id, message_text, timestamp) VALUES (?, ?, ?, ?)",
      [from, to, message, timestamp],
      (err, result) => {
        if (err) {
          console.error(err);
          next(err);
        } else {
          res.status(200).send("Message saved to database");
        }
      }
    );
  } catch (ex) {
    next(ex);
  }
};
