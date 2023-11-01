const { default: mongoose } = require("mongoose");
const { users, mpesaDeposits: Deposits } = require("@models");
const { messages } = require("@utils");

const tinypesaWebhook = async (req, res) => {
  let session;
  try {
    const stkCallback = req.body.Body.stkCallback;
    const { CallbackMetadata } = stkCallback;
    const { Msisdn, Amount, ResultDesc, ResultCode } = stkCallback;

    const [MpesaReceiptNumber] = CallbackMetadata.Item.map(
      (item) => item["Value"]
    );

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

    await Deposits.create(
      [
        {
          userId: userUpdate.userId,
          phone: Msisdn,
          amount: Amount,
          mpesaRef: MpesaReceiptNumber,
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
