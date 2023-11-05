const { default: mongoose } = require("mongoose");
const { users, mpesaDeposits } = require("@models");
const { messages } = require("@utils");

const tinypesaWebhook = async (req, res) => {
  let session;
  try {
    const { Msisdn, Amount, ResultDesc, ResultCode, MpesaReceiptNumber } =
      req.body;

    session = await mongoose.startSession();
    session.startTransaction();

    const user = await users.findOne({ phone: Msisdn });
    if (ResultCode === 0) {
      const userUpdate = await users.updateOne(
        { phone: Msisdn },
        {
          $inc: { accountBalance: Amount },
        },
        session
      );
      if (userUpdate.matchedCount === 0) {
        return res.status(404).json({ message: messages.depositFailed });
      } else if (userUpdate.modifiedCount === 0) {
        return res.status(400).json({ message: messages.depositFailed });
      }
    }

    await mpesaDeposits.create(
      [
        {
          userId: user.userId,
          phone: Msisdn,
          amount: Amount,
          mpesaRef: MpesaReceiptNumber || "none",
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          status: ResultCode == 0 ? "Success" : "Failed",
        },
      ],
      session
    );
    await session.commitTransaction();
    session && session.endSession();

    return res.status(200).json({ message: messages.depositSuccess });
  } catch (error) {
    session && (await session.abortTransaction());
    session && session.endSession();
    throw error;
  }
};

module.exports = { tinypesaWebhook };
