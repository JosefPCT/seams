import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "@repo/database";
import * as passwordUtils from "../utils/passwordUtils.js";

// Custom form field names besides the default 'username' and 'password' can be defined as a custom field here
const customFields = {
  usernameField: "email",
  passwordField: "password",
};

// This callback will be used when calling 'passport.authenticate()'
// Checks if user exists and checks if login credentials are valid
const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: username,
      },
    });

    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }

    // Instead of using a separate function to rehash the login password to compare to the stored hashed password in the db
    // Use the checker function .compare to automatically verify the inputted login password to the hashed store
    // const isValid = await bcrypt.compare(password, user.hash);
    const isValid = await passwordUtils.validatePassword(password, user.hash);

    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect password" });
    }
  } catch (err) {
    return done(err);
  }
};

// To declare what strategy to use and passes on the verify callback and other optional fields such as custom form field names (customFields)
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

// When using Session
// Passport also needs a serializeUser and deserializeUser functions to check them in and out of the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (user) {
      done(null, user);
    }
  } catch (err) {
    done(err);
  }
});

