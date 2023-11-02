const { withdrawals } = require("@models");
const { messages } = require("@utils");

const withdrawalHistory = async (req, res) => {
  const { userId } = req.body;
  const getWithdrawals = await withdrawals.find({ userId });

  return res
    .status(200)
    .json({ message: messages.requestSuccessful, payload: getWithdrawals });
};

module.exports = { withdrawalHistory };
