const { check, validationResult } = require("express-validator");

exports.registerValidation = [
  check("name").trim().not().isEmpty().withMessage("Name is required"),
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password must be 6 char"),
];

exports.validatePassword = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password must be 6 char"),
];

exports.loginValidatior = [
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password must be 6 char"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length) {
    return res.status(422).json({ errors });
  }
  next();
};
