require("dotenv").config({ path: "../.env" });
var admin = require("firebase-admin");
const { uuid } = require("uuidv4");
const connection = require("../db");
var serviceAccount = require("../chat-app-a1d1b-firebase-adminsdk-k7rku-0f2bb3c247.json");
const jwt = require("jsonwebtoken");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports.login = async (req, res, next) => {
  try {
    const { tokenId } = req.body;
    const { name, email } = await admin.auth().verifyIdToken(tokenId);
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          return next(error);
        }
        if (results.length > 0) {
          const user = results[0];
          const token = jwt.sign(
            { name: user.name, email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          res.json({ token, userId: user.user_id });
        } else {
          const userId = uuid();
          connection.query(
            "INSERT INTO users (user_id, name, email, avatar_url) VALUES (?, ?, ?, ?)",
            [userId, name, email, ""],
            (error) => {
              if (error) {
                return next(error);
              }
              const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
                expiresIn: "1h",
              });

              res.json({ token, userId });
            }
          );
        }
      }
    );
  } catch (error) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const avatar_url = req.body.image;
    connection.query(
      "UPDATE users SET avatar_url = ? WHERE user_id = ?",
      [avatar_url, user_id],
      (error, results, fields) => {
        if (error) {
          console.error(error);
          res.status(500).send("Internal server error");
        } else {
          res.json({
            isSet: true,
          });
        }
      }
    );
  } catch (error) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const sql = "SELECT * FROM users";
    connection.query(sql, (err, users) => {
      if (err) {
        res.status(500).send("Error retrieving users from database");
        return;
      }
      // Send the fetched data as response
      res.status(200).json(users);
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
