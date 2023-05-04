const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../models/password_reset_token");
const { jsonError } = require("../utils/responder");
module.exports = {
  isValidResetPasswordToken: async (req, res, next) => {
    const { token, userId } = req.body;
    if (!token.trim() || !isValidObjectId(userId)) {
      return jsonError(res, "Invalid request");
    }

    const passwordResetToken = PasswordResetToken.findOne({ owner: userId });
    if (!passwordResetToken) {
      return jsonError(res, "Invalid request");
    }

    const isMatch = await passwordResetToken.compareToken(token);
    if (!isMatch) {
      return jsonError(res, "Invalid token");
    }
    req.passwordResetToken = passwordResetToken;
    next();
  },
};
