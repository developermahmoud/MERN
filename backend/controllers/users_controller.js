const User = require("../models/user");
const PasswordResetToken = require("../models/password_reset_token");
const EmailVerificationToken = require("../models/email_verification_token");
const { isValidObjectId } = require("mongoose");
const { generateOTP, sendEmail } = require("../utils/mail");
const { jsonError } = require("../utils/responder");
const { generateRandomByte } = require("../utils/helper");
const jwt = require("jsonwebtoken");
module.exports = {
  register: async (req, res) => {
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

    res.status(201).json({
      user,
      messgae: "Please verify your email. OTP has been sent to your email!",
    });
  },
  emailVerification: async (req, res) => {
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

    res.status(200).json({ message: "Your email is verivied" });
  },
  resendEmailVerification: async (req, res) => {
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

    res.status(200).json({
      messgae: "Please verify your email. OTP has been sent to your email!",
    });
  },
  forgetPassword: async (req, res) => {
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

    return res.status(200).json({ message: "Linke has been sent." });
  },
  resetPassword: async (req, res) => {
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
    res.status(200).json({ message: "Password reset successfully." });
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return jsonError(res, "Invalid credentials!");
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return jsonError(res, "Invalid credentials!");
    }

    const jwtToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KET)

    res.status(200).json({user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: jwtToken
    }});
  },
};
