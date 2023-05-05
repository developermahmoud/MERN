import { check, validationResult } from "express-validator";

export const registerValidation = [
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

export const validatePassword = [
  check("email").normalizeEmail().isEmail().withMessage("Email is invalid"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password must be 6 char"),
];

export const loginValidatior = [
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("password must be 6 char"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req).array();
  if (errors.length) {
    return res.status(422).json({ errors });
  }
  next();
};
