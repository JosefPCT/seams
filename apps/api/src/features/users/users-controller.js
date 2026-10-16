import { validationResult, matchedData } from 'express-validator';

import * as validation from "../../middleware/validation.js"
import * as usersService from "./users-service.js";
import { isAdmin, isAdminOrIsOwnUserData, isAuth } from "../../middleware/authMiddleware.js";



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
    
    const { email, password, first_name, last_name, isAdmin} = matchedData(req);

    const newUser = await usersService.createUser({ email, password, first_name, last_name, isAdmin});

    res.status(200).json({ message: "You are in POST '/users' route", data: newUser});
  }
]

// GET '/users'
// Shows a list of all users
// Req query: page (int/number), limit (int/number), searchTerm(string), sortOrder('asc'/'desc'), sortBy(ideally a valid field to sort by), and include(array of strings on what relation to include (profile,messages,groups))
export const usersGetRoute = [
  async(req, res, next) => {
    const { page, limit, searchTerm, sortOrder, sortBy, include } = req.query;
    
    // If only one value is passed to include, makes sure it is turned into an array instead of just a string
    const includeArr = Array.isArray(include) ?  include : [include].filter(Boolean);

    const users = await usersService.getAllUsers(req.protocol, req.get('host'), { page, limit, searchTerm, sortBy, sortOrder, includeArr });

    res.status(200).json({ message: "You are in GET '/users' route", data: users});
  }
]

// GET '/users/me'
// Show the current user
export const userMeGetRoute = [
  isAuth,
  async(req, res, next) => {
    const user = await usersService.getCurrentUser(req.user.publicId, req.protocol, req.get('host'));

    if(!user){
        return res.status(400).json({ error: true, message: "User was not found"});
    }
    
    res.status(200).json({ message: "You are in GET '/users/me' route", data: user });
  }
]

// GET '/users/:userPublicId'
// Show a specific user by their public id
export const userByPublicIdGetRoute = [
  async(req, res, next) => {
    const { userPublicId } = req.params;
    const user = await usersService.getUserByPublicId(userPublicId, req.protocol, req.get('host'));

    if(!user){
        return res.status(400).json({ error: true, message: "User was not found"});
    }

    // console.log("Showing...");
    // console.log(req.protocol);
    // console.log(req.get('host'));
    // console.log(req.originalUrl);
    // console.log(req);
    // console.log(PROFILE_URL);

    res.status(200).json({ message: `You are in GET '/users/${userPublicId}' route`, data: user});
  }
]

// PUT '/users/:userPublic'
// Update a specific user by their public id
// TODO: Only access if user is updating their own info (password) or user is an admin
export const userPutRoute = [
  isAdminOrIsOwnUserData,
  validation.validateUpdateUser,
  async(req, res, next) => {
    const { userPublicId } = req.params;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }
    
    const updatedUser = await usersService.updateUser(userPublicId, matchedData(req));

    if(!updatedUser){
      return res.status(400).json({ error: true, message: "User was not updated succesfully"});
    }
    
    res.status(200).json({ message: `You are in PUT '/users/${userPublicId}' route`, data: updatedUser });
  }
]

// DELETE '/users/:userPublicId'
// Delete a specific user by their public id
// TODO: Only access if user is deleting their account or user is an admin
export const userDeleteRoute = [
  async(req, res, next) => {
    const { userPublicId } = req.params;

    

    const deletedUser = await usersService.deleteUser(userPublicId);
    if(!deletedUser){
        return res.status(400).json({ error: true, message: "User was not deleted succesfully"});
    }

    // Block of code responsible for clearing the current session cookies automatically
    req.session.destroy((err) => {
      if (err) {
        return next(err); // Handle session destruction error
      }

      // 3. Clear the session cookie from the client's browser
      res.clearCookie('connect.sid'); // Replace 'connect.sid' with your cookie name if custom
      
      //return res.status(200).json({ message: "Account deleted and logged out successfully" });
      res.status(200).json({ message: `You are in DELETE '/users/${userPublicId}' route`, data: deletedUser });
    });
  }
]