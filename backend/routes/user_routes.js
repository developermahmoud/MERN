import express from "express";
const router = express.Router();
import {
  login,
  register,
  emailVerification,
  resendEmailVerification,
  forgetPassword,
  resetPassword,
} from "../controllers/users_controller.js";
import {
  registerValidation,
  validate,
  validatePassword,
} from "../validation/user_validation.js";
import { isValidResetPasswordToken } from "../middleware/user_middleware.js";

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

export default router;
