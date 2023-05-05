import User from "../models/user.js";
import PasswordResetToken from "../models/password_reset_token.js";
import EmailVerificationToken from "../models/email_verification_token.js";
import { isValidObjectId } from "mongoose";
import { generateOTP, sendEmail } from "../utils/mail.js";
import { jsonError, jsonOK } from "../utils/responder.js";
import { generateRandomByte } from "../utils/helper.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return jsonError(res, "Email already exitst", 422);
    }
    const user = new User({ name, email, password });
    await user.save();

    const OTP = generateOTP();

    const emailVerificationToken = new EmailVerificationToken({
      owner: user._id,
      token: OTP,
    });
    await emailVerificationToken.save();

    sendEmail(
      user.email,
      "OTP verification",
      `<p>Your verification OTP ${OTP}</p>`
    );

    return jsonOK(
      res,
      user,
      "Please verify your email. OTP has been sent to your email!",
      201
    );
  } catch (error) {
    return jsonError(error.message, 400);
  }
};
export const emailVerification = async (req, res) => {
  try {
    const { userId, OTP } = req.body;
    if (!isValidObjectId(userId)) {
      return jsonError(res, "Invalid user!");
    }
    const user = await User.findById(userId);
    if (!user) {
      return jsonError(res, "User not found!");
    }

    if (user.isVerified) {
      return jsonError(res, "User already verified");
    }

    const token = await EmailVerificationToken.findOne({ owner: user._id });
    if (!token) {
      return jsonError(res, "Token not found");
    }

    const isMatched = await token.compareToken(OTP);
    if (!isMatched) {
      return jsonError(res, "Invalid OTP");
    }
    user.isVerified = true;
    await user.save();
    await EmailVerificationToken.findByIdAndDelete(token._id);

    sendEmail(user.email, "Email verivied", `<p>Your email is verivied</p>`);

    return jsonOK(res, "", "Your email is verivied");
  } catch (error) {
    return jsonError(error.message, 400);
  }
};
export const resendEmailVerification = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!isValidObjectId(userId)) {
      return jsonError(res, "Invalid user!");
    }
    const user = await User.findById(userId);
    if (!user) {
      return jsonError(res, "User not found!");
    }

    if (user.isVerified) {
      return jsonError(res, "User already verified");
    }

    await EmailVerificationToken.findOneAndDelete({ owner: user._id });

    const OTP = generateOTP();

    const emailVerificationToken = new EmailVerificationToken({
      owner: user._id,
      token: OTP,
    });
    await emailVerificationToken.save();
    sendEmail(
      user.email,
      "Email Verification",
      `<p>Your verification OTP ${OTP}</p>`
    );
    return jsonOK(
      res,
      "",
      "Please verify your email. OTP has been sent to your email!"
    );
  } catch (error) {
    return jsonError(error.message, 400);
  }
};
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return jsonError(res, "Email not found");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return jsonError(res, "User not found", 404);
    }

    PasswordResetToken.findOneAndDelete({ owner: user._id });

    const token = await generateRandomByte();
    const passwordResetToken = PasswordResetToken({
      owner: user._id,
      token,
    });
    await passwordResetToken.save();

    sendEmail(
      user.email,
      "Reset password link",
      `http://localhost:3000/reset?token=${token}&id=${user._id}`
    );
    return jsonOK(res, "", "Linke has been sent.");
  } catch (error) {
    return jsonError(error.message, 400);
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { password, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return jsonError(res, "User not found", 404);
    }

    const isMatched = await user.comparePassword(password);
    if (isMatched) {
      return jsonError(
        res,
        "The password must be different from the old one!",
        400
      );
    }

    user.password = password;
    await user.save();
    await PasswordResetToken.deleteOne({ owner: user._id });

    return jsonOK(res, "", "Password reset successfully.", 202);
  } catch (error) {
    return jsonError(error.message, 400);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return jsonError(res, "Invalid credentials!");
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return jsonError(res, "Invalid credentials!");
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KET);

    return jsonOK(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        token: jwtToken,
      },
      "login successfully"
    );
  } catch (error) {
    return jsonError(error.message, 400);
  }
};
