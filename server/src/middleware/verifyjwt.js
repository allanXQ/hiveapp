const jwt = require("jsonwebtoken");
const { messages } = require("@utils");
require("dotenv").config();

const verifyjwt = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return res.status(401).json({ message: messages.invalidToken });
    }
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: messages.invalidToken });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: messages.serverError });
  }
};

module.exports = verifyjwt;
