import * as profileUtils from "./profiles-utils.js";
import * as profileQueries from "./profiles-queries.js";
import * as usersQueries from "../users/users-queries.js";
import * as customError from "../../utils/extended-errors.js";
import { preparePatchData } from "../../utils/organizeDataUtils.js";

const USERS_URL = `/api/v1/users`;
const PROFILES_URL = `/api/v1/profiles`

// profileData has: name, pronouns, bio, targetUserPublicId
// Checks if already created profile for the user
export const createProfile = async(profileData, protocol, host) => {
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
    const {publicId, user, ...rest} = createdProfile;
    const { publicId: userPublicIdAlias, ...restOfUser} = user;
    const formattedProfile = {
      id: publicId,
      ...rest,
      user: {
        id: userPublicIdAlias,
        ...restOfUser
      }, 
      links: {
        self: new URL(`/api/v1/profiles/${publicId}`, `${protocol}://${host}`),
        usersUrl: new URL(`${USERS_URL}/${userPublicIdAlias}`, `${protocol}://${host}`),
      }
    }
    return formattedProfile;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Determines if userPublicId query paramter is present, if it is uses it in a query, if not, removes it from the query (undefined)
export const fetchAllProfiles = async({page=1, limit=5, searchTerm="", sortBy='createdAt', sortOrder='asc', includeArr=[]} = {}, protocol, host) => {

  // The option object for the query layer to use
  const options = {
    take: Number(limit),
    skip: (Number(page) * Number(limit)) - limit,
    searchTerm,
    isSearchTermUUID: profileUtils.isValidV4UUID(searchTerm),
    sortOrder,
    sortBy,
  }

  const totalProfiles = await profileQueries.getTotalProfiles();
  const totalNumberOfPages = Math.floor(totalProfiles.length / Number(limit)) < 1 ? 1 : Math.floor(totalProfiles.length / Number(limit))


  const profiles = await profileQueries.findAllProfiles(options, profileUtils.prepareProfileSelectObj(includeArr))
  if (profiles.length === 0) {
      return [];
  }

  const formattedProfiles = await profileUtils.formatReturnProfilesList(profiles, protocol, host);


  return {
      meta: {
        "current_page": page,
        "per_page": limit,
        "total_records": totalProfiles.length,
      },
      links: {
        first: Number(page) === 1 ? null : new URL(`${PROFILES_URL}?page=1`, `${protocol}://${host}`),
        prev: Number(page) === 1 ? null: new URL(`${PROFILES_URL}?page=${Number(page) - 1}`, `${protocol}://${host}`),
        self: new URL(`${PROFILES_URL}?page=${page}&limit=${limit}`, `${protocol}://${host}`),
        next: Number(page) >= totalNumberOfPages ? null: new URL(`${PROFILES_URL}?page=${Number(page) + 1}`, `${protocol}://${host}`),
        last: Number(page) === totalNumberOfPages ? null: new URL(`${PROFILES_URL}?page=${totalNumberOfPages}`, `${protocol}://${host}`)
      },
      data: formattedProfiles
    }
}

export const fetchSpecificProfile = async(publicId, { includeArr }, protocol, host) => {

  const profile = await profileQueries.findProfileByPublicId(publicId, profileUtils.prepareProfileSelectObj(includeArr));
  if(!profile){
    throw new customError.NotFound(`Profile with public id: ${userPublicId} not found`);
  }
  const formattedProfile = profileUtils.formatReturnProfile(profile, protocol, host);
  
  return formattedProfile;

}
// data object has potentially a field of either or all: name, pronouns, bio
export const updateSpecificProfile = async(profilePublicId, data) => {
  const profile = await profileQueries.getProfileByPublicId(profilePublicId);
  if(!profile){
    throw new customError.BadRequest(`Profile does not exist`);
  }

  const preparedData = preparePatchData(data);

  const updatedProfile = await profileQueries.updateProfileByPublicId(profilePublicId, preparedData);
  const { publicId, ...rest } = updatedProfile;

  return {
    id: publicId,
    ...rest
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