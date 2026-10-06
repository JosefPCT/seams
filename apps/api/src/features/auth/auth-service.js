import * as passwordUtils from '../../utils/passwordUtils.js';
import * as authQueries from "./auth-queries.js";

// Creates a hash from the user input (password) and send it along with the other data to the query layer
export const registerUser = async(email, password, first_name, last_name) => {
  try {
    const hashedPassword = await passwordUtils.genPassword(password);
    const hash = hashedPassword.hash;
    const registeredUser = await authQueries.createNewUser(email, hash, first_name, last_name);
    return registeredUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}