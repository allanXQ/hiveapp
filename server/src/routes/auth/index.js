const router = require("express").Router();
const { verifyjwt, formValidate } = require("@middleware");
const {
  updatePassword,
  login,
  register,
  resetPassword,
  forgotPassword,
  refreshToken,
  logout,
  googleOAuth,
} = require("@controllers/auth");
const {
  regSchema,
  loginSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  userInfoSchema,
} = require("@yupschemas");

const { errorHOC } = require("@utils");

// routes
router.post("/register", formValidate(regSchema), errorHOC(register));
router.post("/login", formValidate(loginSchema), errorHOC(login));
router.post(
  "/reset-password/:id/:token",
  formValidate(resetPasswordSchema),
  errorHOC(resetPassword)
);
router.post("/refresh-token", errorHOC(refreshToken));
router.post("/logout", formValidate(userInfoSchema), errorHOC(logout));

router.post(
  "/forgot-password",
  formValidate(forgotPasswordSchema),
  errorHOC(forgotPassword)
);
router.post(
  "/update-password",
  verifyjwt,
  formValidate(updatePasswordSchema),
  errorHOC(updatePassword)
);

router.get("/google", googleOAuth);

module.exports = router;
