const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors")({
  origin: true,
});

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
require("dotenv").config({ path: "../.env" });

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("Working ");
});

global.onlineUsers = new Map();
exports.app = functions.https.onRequest((req, res) => {
  res.set(
    "Access-Control-Allow-Origin",
    "https://chat-app-frontend123.web.app"
  );
  res.set("Access-Control-Allow-Headers", "Content-Type");
  cors(req, res, () => {
    app(req, res);
  });
});
