const { withdrawalHistory } = require("./withdrawalHistory");
const { mpesaDepositHistory } = require("./depositHistory");
const { mpesaDeposit } = require("./mpesaDeposit");
const { mpesaWithdraw } = require("./mpesaWithdraw");
const { tinypesaWebhook } = require("./tinypesaWebhook");

module.exports = {
  withdrawalHistory,
  mpesaDepositHistory,
  mpesaDeposit,
  mpesaWithdraw,
  tinypesaWebhook,
};
