require("dotenv").config();
const { users } = require("@models");
const bcrypt = require("bcrypt");
const { messages } = require("@utils");

const updatePassword = async (req, res) => {
  const { userId, oldPassword, newPassword: plainPassword } = req.body;
  const getUser = await users.findOne({ userId });
  if (!getUser) {
    return res.status(400).json({ message: messages.userNotFound });
  }
  const bcompare = await bcrypt.compare(oldPassword, getUser.password);
  if (!bcompare) {
    return res.status(400).json({ message: messages.incorrectPassword });
  }
  hashedPassword = await bcrypt.hash(plainPassword, 10);
  const userUpdate = await users.updateOne(
    { userId },
    {
      $set: { password: hashedPassword },
    }
  );
  if (userUpdate.nModified === 0) {
    return res.status(400).json({ message: messages.updateFailed });
  }
  res.status(200).json({ message: messages.updateSuccess });
};

module.exports = { updatePassword };
