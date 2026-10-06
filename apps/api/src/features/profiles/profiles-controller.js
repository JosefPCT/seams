import { validationResult, matchedData } from 'express-validator';

import { isAuth, isOwnProfile, isUserNoProfile } from "../../middleware/authMiddleware.js";
import * as profileService from "./profiles-service.js";
import * as validation from "../../middleware/validation.js"

// Endpoint: POST '/profiles?userPublicId={id}
// A route to create a new profile for the user if a profile has not existed yet
// Uses a validation middleware to check for empty fields, then sends those fields along with the current user's userId to the service layer
// Validates to check if user already has a profile or not
// Gets the public id either on the passed query or the current logged in user's public id
export const profilesPostRoute = [
  isAuth,
  isUserNoProfile,
  validation.validateProfile,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const { userPublicId } = req.query;

    const { name, pronouns, bio } = matchedData(req);
    const targetUserPublicId = userPublicId || req.user.publicId;
    const createdProfile = await profileService.createProfile({name, pronouns, bio, targetUserPublicId});
    if(!createdProfile){
      return res.status(400).json({ error: true, message: "Profile was not created succesfully"});
    }

    res.status(200).json({ message: 'You created a new profile', data: createdProfile});
  }
]

// GET `/profiles?user_public_id={userPublicId}`
// Get all the current profiles in the db
// OR redirect to the user's specific profile '/profile/:profilePublicId'
// TODO: If a search parameter is included (user_public_id), query in to the user model to get the internal id and use the `id` for a condition on the search query
export const profilesGetRoute = [
  async(req, res, next) => {
    const { userPublicId } = req.query;
    
    const profiles = await profileService.fetchAllProfiles(userPublicId);
    if(!profiles){
      return res.status(400).json({ error: true, message: "No Profiles detected"});
    }

    // console.log("Checking truth status:");
    // console.log(req.user);
    // console.log(!!req.user.profile);

    res.status(200).json({ message: "/profile GET route, showing all profiles", data: profiles});
  }
]


// GET `/profiles/:publicId`
// Get a specific profile based on it's public ID
export const specificProfileGetRoute = [
  async(req,res,next) => {
    console.log("Specific Profile of public id:");
    console.log(req.params.profilePublicId);
    const profile = await profileService.fetchSpecificProfile(req.params);

    if(!profile){
      return res.status(400).json({ error: true, message: "No profile with this public id is detected"});
    }

    res.status(200).json({ message: `/profile/:profilePublicId GET route, profilePublicId: ${req.params.profilePublicId}`, data: profile});
  }
]

// PUT `/profiles/:publicId`
// Edit a specific profile, can only be accessed by their own user
export const specificProfileUpdateRoute = [
  isOwnProfile,
  validation.validateUpdateProfile,
  async(req, res, next) => {
    const { profilePublicId } = req.params;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const updatedProfile = await profileService.updateSpecificProfile(profilePublicId, matchedData(req));

    if(!updatedProfile){
      return res.status(400).json({ error: true, message: "Profile was not updated succesfully"});
    }

    res.status(200).json({ message: `/profile/:profilePublicID PUT route, profilePublicId: ${profilePublicId}`, data: updatedProfile});
  }
]

// DELETE `/profiles/:publicId`
// Delete a specific profile, can only be accessed by their own user
export const specificProfileDeleteRoute = [
  isOwnProfile,
  async(req, res, next) => {
    const { profilePublicId } = req.params;

    const deletedProfile = await profileService.deleteSpecificProfile(profilePublicId);
    if(!deletedProfile){
      return res.status(400).json({ error: true, message: "Profile was not deleted succesfully"});
    }

    res.status(200).json({ message: "Deleted your own profile", data: deletedProfile});
  }
]