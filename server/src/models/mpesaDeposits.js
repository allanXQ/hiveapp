const mongoose = require("mongoose");

const mpesaDeposits = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    mpesaRef: { type: String, required: true },
    phone: { type: Number, required: true },
    amount: { type: Number, required: true },
    resultCode: { type: Number, required: true },
    resultDesc: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("mpesaDeposits", mpesaDeposits);

module.exports = model;
