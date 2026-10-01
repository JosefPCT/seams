import { validationResult, matchedData } from 'express-validator';
import passport from "passport";

import * as authService from "./auth-service.js";
import * as validation from "../../middleware/validation.js"
import { isAuth } from "../../middleware/authMiddleware.js";


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
    res.status(200).json({ message: "Current user is authorized, is now viewing a protected route"})
  }
]