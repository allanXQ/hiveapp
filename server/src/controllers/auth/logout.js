const { users } = require("@models");
const { messages } = require("@utils");
const { clearTokens } = require("@utils");

const logout = async (req, res) => {
  const { userId } = req.body;
  const user = await users.findOneAndUpdate(
    { userId },
    {
      $set: { refreshToken: null },
    },
    { new: true }
  );
  if (!user) {
    clearTokens(res);
    return res.status(401).json({ message: messages.invalidToken });
  }
  clearTokens(res);
  return res.status(200).json({ message: messages.logOutSuccess });
};

module.exports = { logout };
