const { users } = require("@models");
const { messages } = require("@utils");

const userInfo = async (req, res) => {
  const { userId } = req.body;
  const userData = await users.aggregate([
    {
      $match: {
        userId,
      },
    },
    {
      $lookup: {
        from: "mpesadeposits",
        localField: "userId",
        foreignField: "userId",
        as: "mpesaDeposits",
      },
    },
    {
      $lookup: {
        from: "withdrawals",
        localField: "userId",
        foreignField: "userId",
        as: "withdrawals",
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
        passwordResetToken: 0,
        // any other fields you want to exclude...
      },
    },
  ]);
  return res.status(200).json({
    message: messages.requestSuccessful,
    payload: {
      user: userData[0],
    },
  });
};

module.exports = userInfo;
