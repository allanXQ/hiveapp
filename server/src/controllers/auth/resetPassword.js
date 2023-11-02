require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("@models");
const { messages } = require("@utils");

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { id, token } = req.params;
  if (!token || !id || !password) {
    return res.status(400).json({ message: messages.invalidRequest });
  }
  const getUser = await users.findOne({ userId: id });
  if (!getUser) {
    return res.status(400).json({ message: messages.userNotFound });
  }
  const passwordResetToken = getUser.passwordResetToken;
  if (passwordResetToken.length === 0) {
    return res.status(400).json({ message: messages.invalidRequest });
  }

  const secret = process.env.JWT_SECRET;
  const verify = jwt.verify(token, secret);
  if (!verify) {
    return res.status(403).json({ message: messages.invalidToken });
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  const userUpdate = await users.findOneAndUpdate(
    { userId: id },
    {
      $set: { password: hashedpassword, passwordResetToken: "" },
    },
    { new: true }
  );
  if (!userUpdate) {
    return res.status(400).json({ message: messages.requestFailed });
  }
  res.status(200).json({ message: messages.requestSuccessful });
};

module.exports = { resetPassword };
