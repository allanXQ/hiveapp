const router = require("express").Router();
const formValidate = require("../../middleware/validate");
const { verifyjwt } = require("../../middleware/verifyjwt");
const {
  userInfo,
  mpesaWithdraw,
  tinypesaWebhook,
  mpesaDeposit,
  mpesaDepositHistory,
  withdrawalHistory,
} = require("@controllers/user");
const {
  depositSchema,
  withdrawalSchema,
  userInfoSchema,
} = require("@yupschemas");

const { errorHOC } = require("@utils");

//wallet routes
router.post(
  "/transact/mpesa/deposit",
  verifyjwt,
  formValidate(depositSchema),
  errorHOC(mpesaDeposit)
);
router.post("/transact/tinypesa/webhook", errorHOC(tinypesaWebhook));
router.post(
  "/transact/withdraw",
  verifyjwt,
  formValidate(withdrawalSchema),
  errorHOC(mpesaWithdraw)
);

router.post(
  "/history/deposits",
  verifyjwt,
  formValidate(userInfoSchema),
  errorHOC(mpesaDepositHistory)
);
router.post(
  "/history/withdrawals",
  verifyjwt,
  formValidate(userInfoSchema),
  errorHOC(withdrawalHistory)
);

router.post(
  "/user-info",
  verifyjwt,
  formValidate(userInfoSchema),
  errorHOC(userInfo)
);

module.exports = router;
