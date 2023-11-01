//auth controllers
const {
  updatePassword,
  login,
  register,
  resetPassword,
  forgotPassword,
  refreshToken,
  logout,
  googleOAuth,
} = require("../auth");
const userInfo = require("../user/userInfo");

//wallet controllers
const {
  mpesaDeposit,
  tinypesaWebhook,
  mpesaWithdraw,
  withdrawalHistory,
  mpesaDepositHistory,
} = require("./wallet");

module.exports = {
  updatePassword,
  login,
  register,
  resetPassword,
  forgotPassword,
  refreshToken,
  logout,
  googleOAuth,
  userInfo,

  mpesaDeposit,
  tinypesaWebhook,
  mpesaWithdraw,
  withdrawalHistory,
  mpesaDepositHistory,
};
