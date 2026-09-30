import { body, validationResult, matchedData } from 'express-validator';
import * as authService from "./auth-service.js";

// Validation Messages
const emptyErr = `must not be empty`;
const notSamePassErr = `Password field and Confirm Password field must be the same`;
const emailAlreadyExistsErr = `Email already exists.`;

// Custom Validators
const isSamePass = (value, { req }) => {
  if (value !== req.body.password) {
    throw new Error(notSamePassErr);
  }
  return true;
};

// Custom validator to check if email already exists in the DB
// const emailExists = async (value) => {
//   const data = await queries.findUserByEmail(value);
//   if (data) {
//     throw new Error(emailAlreadyExistsErr);
//   }
//   return true;
// };

// Validation
// Uses custom methods from express-validator package
const validateUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email field ${emptyErr}`)
    .normalizeEmail()
    .isEmail()
    .withMessage(`Email must be a valid email`),
    // .custom(emailExists),
  body("password").trim().notEmpty().withMessage(`Password field ${emptyErr}`),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm Password field ${emptyErr}`)
    .custom(isSamePass),
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage(`First name field ${emptyErr}`),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage(`Last name field ${emptyErr}`),
];


export const registerPostRoute = [
  validateUser,
  async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const { email, password, first_name, last_name } = matchedData(req);
    const registeredUser = await authService.registerUser(email, password, first_name, last_name);

    return res.status(200).json(registeredUser);
  }
]