import * as usersQueries from "./users-queries.js";
import * as customError from "../../utils/extended-errors.js";

import * as passwordUtils from '../../utils/passwordUtils.js';

// userData object has: email, password, confirm_password, first_name, last_name (optional: isAdmin)
// Double checks if user's email already exists in the database
// Uses password utility to transform the password string into hash, add the hash into the userData object and passed onto the query
export const createUser = async(userData) => {
  try {
    const user = await usersQueries.findUserByEmail(userData.email);
    if(user){
      throw new customError.BadRequest(`Email already exists`);
    }

    const hashedPassword = await passwordUtils.genPassword(userData.password);
    const hash = hashedPassword.hash;
    userData.hash = hash;

    const newUser = await usersQueries.createNewUser(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getAllUsers = async() => {
  try {
    const users = await usersQueries.fetchAllUsers();
    return users; 
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getCurrentUser = async(userPublicId) => {
  try {
    const user = await usersQueries.fetchCurrentUserByPublicId(userPublicId);
    if(!user){
      throw new customError.NotFound(`User with public id: ${userPublicId} not found`);
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getUserByPublicId = async(userPublicId) => {
  try {
    const user = await usersQueries.findUserByPublicId(userPublicId);
    console.log("Showing current user");
    console.log(user);
    if(!user){
      throw new customError.NotFound(`User with public id: ${userPublicId} not found`);
    }

    return user;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateUser = async(userPublicId, userData) => {
  try {
    const user = await usersQueries.findUserByPublicId(userPublicId);
    if(!user){
      throw new customError.BadRequest(`User does not exist`);
    }

    if(userData.password){
      const hashedPassword = await passwordUtils.genPassword(userData.password);
      const hash = hashedPassword.hash;
      userData.hash = hash;
    }

    const filteredUserData = {
      email: userData.email,
      hash: userData.hash,
      addtl: userData.addtl
    }
    
    const updatedUser = await usersQueries.updateUserByPublicId(userPublicId, filteredUserData);
    return updatedUser;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const deleteUser = async(userPublicId) => {
  try {
    const user = await usersQueries.findUserByPublicId(userPublicId);
    if(!user){
      throw new customError.BadRequest(`User does not exist`);
    }

    const deletedUser = await usersQueries.deleteUserByPublicId(userPublicId);
    return deletedUser;

  } catch (error) {
    console.log(error);
    throw error;
  }
}