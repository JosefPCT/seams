import { body } from 'express-validator';
import { prisma } from "@repo/database"

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
const emailExists = async (value) => {
  const data = await prisma.user.findFirst({
    where: {
      email: value,
    },
  });
  if (data) {
    throw new Error(emailAlreadyExistsErr);
  }
  return true;
};

// Validation Middleware
// Uses custom methods from express-validator package
const validateUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email field ${emptyErr}`)
    .normalizeEmail()
    .isEmail()
    .withMessage(`Email must be a valid email`)
    .custom(emailExists),
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

const validateProfile = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(`Name field ${emptyErr}`),
  body("pronouns")
    .trim()
    .notEmpty()
    .withMessage(`Pronoun field ${emptyErr}`),
  body("bio")
    .trim()
    .notEmpty()
    .withMessage(`Bio field ${emptyErr}`),
]

export { validateUser, validateProfile }