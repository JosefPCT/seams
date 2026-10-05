import * as profileQueries from "./profiles-queries.js";
import * as usersQueries from "../users/users-queries.js";
import * as customError from "../../utils/extended-errors.js";

// profileData has: name, pronouns, bio, userId
// TODO: create a check if already created profile for the user
export const createProfile = async(profileData) => {
  try {
    const currentUser = await usersQueries.findUserByPublicId(profileData.targetUserPublicId);
    if(!currentUser){
      throw new customError.BadRequest(`No selected user to create a profile for`);
    }

    // Places the internal id of the user to the profile data object
    profileData.userId = currentUser.id;

    // Checks if a user already has created a profile
    const profile = await profileQueries.getProfileByUserId(profileData.userId);
    if(profile){
      throw new customError.BadRequest(`User already has profile`);
    }

    const createdProfile = await profileQueries.createProfileByUserId(profileData);
    return createdProfile;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Determines if userPublicId query paramter is present, if it is uses it in a query, if not, removes it from the query (undefined)
export const fetchAllProfiles = async(userPublicId) => {
  try {

    let user;
    if(userPublicId){
      user = await usersQueries.findUserByPublicId(userPublicId);
    }

    const profiles = user ? await profileQueries.findAllProfiles(user.id) : await profileQueries.findAllProfiles();

    return profiles;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const fetchSpecificProfile = async(params) => {
  try {
    const profile = await profileQueries.findSpecificProfileByProfileId(params.profilePublicId);
    return profile;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateSpecificProfile = async(profilePublicId, data) => {
  try {
    console.log("Updating...");
    console.log(profilePublicId);
    console.log(data);

    const profile = await profileQueries.getProfileByPublicId(profilePublicId);
    if(!profile){
      throw new customError.BadRequest(`Profile does not exist`);
    }

    const updatedProfile = await profileQueries.updateProfileByPublicId(profilePublicId, data);
    return updatedProfile;

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const deleteSpecificProfile = async(profilePublicId) => {
  try {
    const profile = await profileQueries.getProfileByPublicId(profilePublicId);
    if(!profile){
      throw new customError.BadRequest(`Profile does not exist`);
    }

    const deletedProfile = await profileQueries.deleteProfileByPublicId(profilePublicId);
    return deletedProfile;
  } catch (error) {
    console.log(error);
    throw error;
  }
}