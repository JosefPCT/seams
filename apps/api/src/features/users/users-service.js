import * as usersQueries from "./users-queries.js";
import * as customError from "../../utils/extended-errors.js";
import * as usersUtils from "./users-utils.js"

import * as passwordUtils from '../../utils/passwordUtils.js';
import { isValidV4UUID } from "../../utils/stringUtils.js";
import { createPrismaOrderByObjectArray } from "../../utils/createOrderByObj.js";
import { preparePatchData } from "../../utils/organizeDataUtils.js";

// Constants
const USERS_URL = `/api/v1/users`;
const PROFILE_URL = `/api/v1/profiles`;
const GROUP_URL = `/api/v1/chat-groups`;
const MESSAGE_URL = `/api/v1/messages`;



// userData object has: email, password, first_name, last_name (optional: isAdmin)
// Double checks if user's email already exists in the database
// Uses password utility to transform the password string into hash, add the hash into the userData object and passed onto the query
// Filters out sensitive data fields (using destructuring and creating a new object) before returning
export const createUser = async(userData) => {
    const user = await usersQueries.findUserByEmail(userData.email);
    if(user){
      throw new customError.BadRequest(`Email already exists`);
    }

    const hashedPassword = await passwordUtils.genPassword(userData.password);
    userData.hash = hashedPassword.hash

    const newUser = await usersQueries.createNewUser(userData);

    const { publicId, ...rest } = newUser;

    const filteredNewUser = {
      id: publicId,
      ...rest
    }

    return {
      links: {
        usersUrl: new URL(`${USERS_URL}/${publicId}`, `${protocol}://${host}`),
      },
      data: filteredNewUser
    }
}

// For GET '/users' routes, we also create 'profileUrl' fields to add onto the JSON response body for easy access to their user profiles
// Uses a constant for the profile URL, protocol and host from `req.protocol` and `req.get('host')` respectively to create the URL
// Optional search query parameters (page, limit, searchTerm, sortBy, sortOrder, include)
// Uses a utility function from another file that creates the select block for the prisma query
// Filters out sensitive data fields (using destructuring and creating a new object) before returning
export const getAllUsers = async(protocol, host, { page = 1, limit = 5, searchTerm = "", sort = "id", includeArr=[]} = {} ) => {
  try {

    // The option object for the query layer to use
    const options = {
      take: Number(limit),
      skip: (Number(page) * Number(limit)) - limit,
      searchTerm,
      isSearchTermUUID: isValidV4UUID(searchTerm),
      createdSortObj: createPrismaOrderByObjectArray(sort),
      createdSelectObj: usersUtils.prepareUsersSelectObj(includeArr)
    }

    const totalUsers = await usersQueries.getAllUsersLength();
    const totalNumberOfPages = totalUsers.length / Number(limit) <= 1 ? 1 : Math.ceil(totalUsers.length / Number(limit))

    const users = await usersQueries.fetchAllUsers(options);

    if (users.length === 0) {
      return [];
    }

    // Call the helper function that helps format the list of users (removing internal ids, and renaming public ids to id in the returned object, adding urls)
    const formattedUsers = await usersUtils.formatReturnUsersList(users, protocol, host);

    return {
      meta: {
        "current_page": page,
        "per_page": limit,
        "total_records": totalUsers.length,
      },
      links: {
        first: new URL(`${USERS_URL}?page=1`, `${protocol}://${host}`),
        prev: Number(page) === 1 ? null: new URL(`${USERS_URL}?page=${Number(page) - 1}`, `${protocol}://${host}`),
        self: new URL(`${USERS_URL}?page=${page}&limit=${limit}`, `${protocol}://${host}`),
        next: Number(page) >= totalNumberOfPages ? null: new URL(`${USERS_URL}?page=${Number(page) + 1}`, `${protocol}://${host}`),
        last: new URL(`${USERS_URL}?page=${totalNumberOfPages}`, `${protocol}://${host}`)
      },
      data: formattedUsers
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getCurrentUser = async(userPublicId, protocol, host) => {
  try {
    const user = await usersQueries.fetchUserByPublicId(userPublicId);
    if(!user){
      throw new customError.NotFound(`User with public id: ${userPublicId} not found`);
    }

    user.links = {
      profileUrl: new URL(`${PROFILE_URL}/${userPublicId}`, `${protocol}://${host}`),
      messagesUrl: new URL(`${MESSAGE_URL}?userPublicId=${userPublicId}`, `${protocol}://${host}`),
      groupsUrl: new URL(`${GROUP_URL}?userPublicId=${userPublicId}`, `${protocol}://${host}`)
    }

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getUserByPublicId = async(userPublicId, protocol, host, { includeArr }) => {
  try {
    const user = await usersQueries.fetchUserByPublicId(userPublicId, usersUtils.prepareUsersSelectObj(includeArr));
    if(!user){
      throw new customError.NotFound(`User with public id: ${userPublicId} not found`);
    }

    const formattedUser = await usersUtils.formatReturnUser(user, protocol, host);
    return formattedUser;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Converts the password into a hash and creates an object with the hash along with other information to pass on to the query layer
export const updateUser = async(userPublicId, userData) => {
  try {
    const user = await usersQueries.findUserByPublicId(userPublicId);
    if(!user){
      throw new customError.BadRequest(`User does not exist`);
    }

    const preparedData = preparePatchData(userData);
    const { password, confirm_password, first_name, last_name, ...data } = preparedData

    let cleanData = {
      ...data,
    }

    if(password){
      const hashedPassword = await passwordUtils.genPassword(password);
      const hash = hashedPassword.hash;
      cleanData.hash = hash
    }
    // Can change to add a validation field for `addtl` instead
    cleanData.addtl = first_name + last_name

    const updatedUser = await usersQueries.updateUserByPublicId(userPublicId, cleanData);

    const { publicId, ...rest } = updatedUser;
    const formattedUser = {
      id: publicId,
      ...rest,
    }
    return formattedUser;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const deleteUser = async(userPublicId) => {
  const user = await usersQueries.findUserByPublicId(userPublicId);
  if(!user){
    throw new customError.BadRequest(`User does not exist`);
  }

  const deletedUser = await usersQueries.deleteUserByPublicId(userPublicId);
  return deletedUser;
}