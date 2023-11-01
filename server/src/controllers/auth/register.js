const crypto = require("crypto");
const id = crypto.randomBytes(6).toString("hex");
const { users } = require("@models");
const bcrypt = require("bcrypt");
const { messages } = require("@utils");

const register = async (req, res) => {
  const {
    username,
    email,
    referrer,
    phone,
    password: plainPassword,
  } = req.body;

  const getUser = await users.findOne({
    $or: [{ username: username }, { email: email }, { phone: phone }],
  });
  if (getUser) {
    return res.status(400).json({ message: messages.invalidUsername });
  }
  const password = await bcrypt.hash(plainPassword, 10);
  await users.create({
    userId: id,
    username,
    email,
    phone,
    referrer,
    password,
    authMethod: "local",
  });
  return res.status(200).json({ message: messages.userCreatedSuccessfully });
};

module.exports = { register };
