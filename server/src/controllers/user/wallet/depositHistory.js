const { mpesaDeposits } = require("@models");
const { messages } = require("@utils");

const mpesaDepositHistory = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: messages.invalidRequest });
  }

  const depositHistory = await mpesaDeposits.find({ userId });
  return res
    .status(200)
    .json({ message: messages.requestSuccessful, payload: depositHistory });
};

module.exports = { mpesaDepositHistory };
