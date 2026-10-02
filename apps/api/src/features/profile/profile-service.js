import * as profileQueries from "./profile-queries.js";
import * as customError from "../../utils/extended-errors.js";

// profileData has: name, pronouns, bio, userId
// TODO: create a check if already created profile for the user
export const createProfile = async(profileData) => {
  try {
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

export const fetchAllProfiles = async() => {
  try {
    const profiles = await profileQueries.findAllProfiles();
    return profiles;
  } catch (error) {
    console.log(error);
    throw error;
  }
}