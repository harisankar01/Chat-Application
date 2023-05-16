const mysql = require("mysql");
require("dotenv").config({ path: "../.env" });
console.log(process.env.SQL_HOST_NAME);
const connection = mysql.createConnection({
  host: process.env.SQL_HOST_NAME,
  user: process.env.SQL_USER_NAME,
  password: process.env.SQL_USER_PASSWORD,
  database: process.env.SQL_DATABASE_NAME,
  charset: "utf8mb4",
  collation: "utf8mb4_unicode_ci",
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database with ID " + connection.threadId);
});
module.exports = connection;
