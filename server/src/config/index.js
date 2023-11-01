const DBConn = require("./dbConn");

const allowedOrigins = ["http://localhost:3000"];

module.exports = {
  DBConn,
  allowedOrigins,
};
