import { validationResult, matchedData } from 'express-validator';

import * as validation from "../../middleware/validation.js"
import * as usersService from "./users-service.js";
import { isAdmin } from "../../middleware/authMiddleware.js";

// POST '/users'
// Handles creation of a new user internally (use '/register' for normal registration)
// Decide if using shared service/queries with the `/register' route from auth resource
// Accepts req.body with fields of: email, password, confirm_password, first_name, last_name and an optional field of: isAdmin
// TODO: Only accessible by an admin?
export const usersPostRoute = [
  isAdmin,
  validation.validateUser,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const newUser = await usersService.createUser(matchedData(req));

    res.status(200).json({ message: "You are in POST '/users' route", data: newUser});
  }
]

// GET '/users'
// Shows a list of all users
export const usersGetRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "You are in GET '/users' route"});
  }
]

// GET '/users/:userPublicId'
// Show a specific user by their public id
export const userByPublicIdGetRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "You are in GET '/users/:userPublicId' route"});
  }
]

// PUT '/users/:userPublic'
// Update a specific user by their public id
// TODO: Only access if user is updating their own info (password) or user is an admin
export const userPutRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "You are in PUT '/users/:userPublicId' route"});
  }
]

// DELETE '/users/:userPublicId'
// Delete a specific user by their public id
// TODO: Only access if user is deleting their account or user is an admin
export const userDeleteRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "You are in DELETE '/users/:userPublicId' route"});
  }
]