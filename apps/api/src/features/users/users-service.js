import * as usersQueries from "./users-queries.js";
import * as customError from "../../utils/extended-errors.js";

import * as passwordUtils from '../../utils/passwordUtils.js';
import { prepareUsersSelectObj } from "../../utils/organizeDataUtils.js";

// Constants
const PROFILE_URL = `/api/v1/profiles`;
const GROUP_URL = `/api/v1/chat-groups`;
const MESSAGE_URL = `/api/v1/messages`


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
    const hash = hashedPassword.hash;
    userData.hash = hash;

    const newUser = await usersQueries.createNewUser(userData);

    const { publicId, ...rest } = newUser;

    const filteredNewUser = {
      id: publicId,
      ...rest
    }

    return filteredNewUser;
}

// For GET '/users' routes, we also create 'profileUrl' fields to add onto the JSON response body for easy access to their user profiles
// Uses a constant for the profile URL, protocol and host from `req.protocol` and `req.get('host')` respectively to create the URL
// Optional search query parameters (page, limit, searchTerm, sortBy, sortOrder, include)
// Uses a utility function from another file that creates the select block for the prisma query
// Filters out sensitive data fields (using destructuring and creating a new object) before returning
export const getAllUsers = async(protocol, host, { page = 1, limit = 5, searchTerm = "", sortBy='id', sortOrder='asc', includeArr=[]} = {} ) => {
  try {

    // The option object for the query layer to use
    const options = {
      take: Number(limit),
      skip: (Number(page) * Number(limit)) - limit,
      searchTerm,
      sortOrder,
      sortBy,
    }

    const users = await usersQueries.fetchAllUsers(options, prepareUsersSelectObj(includeArr));

    if (users.length === 0) {
      return [];
    }

    // Block of code responsible for formatting the returned object (i.e converting public ids to ids)
    // Using map to remove fields from the object (i.e the public id to convert to id in response object) using destructuring
    // Using map to add fields such as the URLs 
    const formattedUsers = users.map(({ publicId, profile, ...user }) => {
      const hasProfile = profile && profile !== null;
      const hasMessages = user.messages && user.messages.length > 0;
      const hasGroups = user.groups && user.groups.length > 0;

      let formattedProfile = null;
      if (hasProfile) {
        const { publicId, ...restOfProfile } = profile;
        formattedProfile = {
          id: publicId,
          ...restOfProfile,
        };
      }

      return {
        id: publicId,
        ...user,
        profileUrl: hasProfile ? new URL(`${PROFILE_URL}/${formattedProfile.id}`, `${protocol}://${host}`): "No profile or profile not included in query",
        messagesUrl: new URL(`${MESSAGE_URL}?userPublicId=${publicId}`, `${protocol}://${host}`),
        groupUrl: new URL(`${GROUP_URL}?userPublicId=${publicId}`, `${protocol}://${host}`),
        profile: formattedProfile,
        groups: hasGroups
          ? user.groups.map(
              ({ publicId: groupPublicId, group, ...restOfGroup }) => {
                let formattedActualGroup = null;
                if (group) {
                  const {
                    publicId: actualGroupPublicId,
                    ...restOfActualGroup
                  } = group;
                  formattedActualGroup = {
                    id: actualGroupPublicId,
                    ...restOfActualGroup,
                  };
                }

                return {
                  id: groupPublicId,
                  ...restOfGroup,
                  group: formattedActualGroup,
                };
              },
            )
          : [],
        messages: hasMessages
          ? user.messages.map(({ publicId, ...messages }) => ({
              id: publicId,
              ...messages,
            }))
          : [],
      };
    });

    console.log(formattedUsers);
    return formattedUsers; 
    
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getCurrentUser = async(userPublicId, protocol, host) => {
  try {
    const user = await usersQueries.fetchCurrentUserByPublicId(userPublicId);
    if(!user){
      throw new customError.NotFound(`User with public id: ${userPublicId} not found`);
    }

    user.profileUrl = new URL(`${PROFILE_URL}?userPublicId=${userPublicId}`, `${protocol}://${host}`);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getUserByPublicId = async(userPublicId, protocol, host) => {
  try {
    const user = await usersQueries.findUserByPublicId(userPublicId);
    if(!user){
      throw new customError.NotFound(`User with public id: ${userPublicId} not found`);
    }

    const { publicId: userPublicIdAlias, profile, ...rest} = user;
    const { publicId: profilePublicIdAlias, ...restProfile} = profile;


 
    const filteredUser = {
      id: userPublicIdAlias,
      profile: {
        id: profilePublicIdAlias,
        ...restProfile
      },
      ...rest,
      profileUrl: profile ? new URL(`${PROFILE_URL}/${userPublicId}`, `${protocol}://${host}`) : "No profile yet",
      chatGroupsUrl: new URL(`${GROUP_URL}/${userPublicId}`, `${protocol}://${host}`),
      messagesUrl: new URL(`${MESSSAGE_URL}/${userPublicId}`, `${protocol}://${host}`)
    }

    return filteredUser;

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