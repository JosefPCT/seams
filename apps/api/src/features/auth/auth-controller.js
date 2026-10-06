import { validationResult, matchedData } from 'express-validator';
import passport from "passport";

import * as authService from "./auth-service.js";
import * as validation from "../../middleware/validation.js"
import { isAuth } from "../../middleware/authMiddleware.js";

// Endpoint: 'POST /api/v1/register'
// Validates and gets the user input in req.body and passes it on to the service layer
// TODO: Pass the `matchedData(req)` directly as an argument and let the service layer handle the data itself
export const registerPostRoute = [
  validation.validateUser,
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

// Endpoint: 'POST api/v1/login'
// Handles the login of a user via 'passport.authenticate' uses the serialize function in the 'passport.js' file to create a req.user object that is accessed by authenticated routes
// Redirects to endpoints depending on success status
export const loginPostRoute = [
  passport.authenticate('local', {
    failureRedirect: '/api/v1/login-failure',
    successRedirect: '/api/v1/login-success'
  })
]

export const loginSuccessGetRoute = [
  async(req, res, next) => {
    res.status(200).json({ success: true, message: "Login successful"})
  }
]

export const loginFailureGetRoute = [
  async(req, res, next) => {
    res.status(500).json({ success: false, message: "Login failure"});
  }
]

// Endpoint: 'GET /api/v1/logout'
// Handles logging out of user via 'req.logout' uses the deserialize function to remove information from 'req.user' object
export const logoutGetRoute = [
  async(req, res, next) => {
    req.logout((err) => {
      if(err) { return next(err) }
      res.json({message: "Logging out..."});
    });
  }
]

export const testProtectedGetRoute = [
  isAuth,
  async(req, res, next) => {
    console.log("Showing user...");
    console.log(req.user);
    console.log(req.user.profile);
    res.status(200).json(req.user);
    // res.status(200).json({ message: "Current user is authorized, is now viewing a protected route"})
  }
]