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
  body("isAdmin")
    .notEmpty()
    .withMessage(`isAdmin field ${emptyErr}`)
    .optional(),
];

const validateUpdateUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email field ${emptyErr}`)
    .normalizeEmail()
    .isEmail()
    .withMessage(`Email must be a valid email`)
    .custom(emailExists)
    .optional(),
  body("password").trim().notEmpty().withMessage(`Password field ${emptyErr}`).optional(),
  body("confirm_password")
    .trim()
    .notEmpty()
    .withMessage(`Confirm Password field ${emptyErr}`)
    .custom(isSamePass)
    .optional(),
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage(`First name field ${emptyErr}`)
    .optional(),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage(`Last name field ${emptyErr}`)
    .optional(),
  body("isAdmin")
    .notEmpty()
    .withMessage(`isAdmin field ${emptyErr}`)
    .optional(),
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

const validateUpdateProfile = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage(`Name field ${emptyErr}`)
    .optional(),
  body("pronouns")
    .trim()
    .notEmpty()
    .withMessage(`Pronoun field ${emptyErr}`)
    .optional(),
  body("bio")
    .trim()
    .notEmpty()
    .withMessage(`Bio field ${emptyErr}`)
    .optional(),
]

export { validateUser, validateUpdateUser, validateProfile, validateUpdateProfile }