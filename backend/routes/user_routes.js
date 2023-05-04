const express = require("express");
const router = express.Router();
const {
  login,
  register,
  emailVerification,
  resendEmailVerification,
  forgetPassword,
  resetPassword,
} = require("../controllers/users_controller");
const {
  registerValidation,
  validate,
  validatePassword,
} = require("../validation/user_validation");
const { isValidResetPasswordToken } = require("../middleware/user_middleware");

router.post("/register", registerValidation, validate, register);
router.post("/verify", emailVerification);
router.post("/resend-verify", resendEmailVerification);
router.post("/forget-password", forgetPassword);
router.put(
  "/reset-password",
  isValidResetPasswordToken,
  validatePassword,
  validate,
  resetPassword
);
router.post("/login", validatePassword, login);

module.exports = router;
