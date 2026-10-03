import * as usersQueries from "./users-queries.js";
import * as customError from "../../utils/extended-errors.js";

import * as passwordUtils from '../../utils/passwordUtils.js';

// profileData has: name, pronouns, bio, userId
// TODO: create a check if already created profile for the user
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