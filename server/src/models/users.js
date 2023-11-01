const mongoose = require("mongoose");

const { roles } = require("@config");

const isLocalAuth = function () {
  return this.authMethod === "local";
};

const Referrals = mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
});

//add kyc
const users = mongoose.Schema(
  {
    userId: { type: String },
    role: { type: String, default: roles.user },
    firstname: { type: String },
    lastname: { type: String },
    googleName: { type: String, required: !isLocalAuth },
    username: { type: String, required: isLocalAuth, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: isLocalAuth, unique: true },
    accountBalance: { type: Number, default: 0 },
    authMethod: {
      type: String,
      enum: ["local", "google"],
      required: true,
    },
    status: { type: String, default: "Unverified" },
    referrer: { type: String, default: "none" },
    refreshToken: { type: String },
    passwordResetToken: { type: String },
    password: { type: String, required: isLocalAuth },
    referrals: [Referrals],
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("users", users);

module.exports = model;
