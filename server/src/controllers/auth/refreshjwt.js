require("dotenv").config();
const jwt = require("jsonwebtoken");

const { users } = require("@models");
const { messages } = require("@utils");
const { generateTokens, setCookies } = require("@utils");

const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: messages.invalidRefreshToken });
  }

  const FindJwt = users.findOne({ refreshToken });

  if (!FindJwt) {
    return res.status(401).json({ message: messages.invalidRefreshToken });
  }
  try {
    const verify = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!verify) {
      //check error
      return res.status(401).json({ message: messages.invalidRefreshToken });
    }

    const tokens = generateTokens(verify);
    setCookies(res, tokens);

    const tokenUpdate = await users.updateOne(
      { refreshToken },
      { $set: { refreshToken: tokens.refreshToken } }
    );

    if (tokenUpdate.nModified === 0) {
      return res.status(401).json({ message: messages.requestFailed });
    }
    return res.status(200).json({ message: messages.tokenRefreshed });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.name = "RefreshTokenExpiredError";
      throw error;
    }
  }
};

module.exports = { refreshToken };
