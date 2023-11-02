const { default: mongoose } = require("mongoose");
const { users, mpesaDeposits } = require("@models");
const { messages } = require("@utils");

const tinypesaWebhook = async (req, res) => {
  let session;
  try {
    const { Msisdn, Amount, ResultDesc, ResultCode, MpesaReceiptNumber } =
      req.body;

    console.log(req.body);

    session = await mongoose.startSession();
    session.startTransaction();

    const userUpdate = await users.findOneAndUpdate(
      { phone: Msisdn },
      {
        $inc: { accountBalance: Amount },
      },
      session
    );
    if (!userUpdate) {
      return res.status(400).json({ message: messages.depositFailed });
    }

    await mpesaDeposits.create(
      [
        {
          userId: userUpdate.userId,
          phone: Msisdn,
          amount: Amount,
          mpesaRef: MpesaReceiptNumber,
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
