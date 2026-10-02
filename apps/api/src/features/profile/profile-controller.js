import { validationResult, matchedData } from 'express-validator';

import { isAuth, isOwnProfile } from "../../middleware/authMiddleware.js";
import * as profileService from "./profile-service.js";
import * as validation from "../../middleware/validation.js"

// A route to create a new profile for the user if a profile has not existed yet
// Uses a validation middleware to check for empty fields, then sends those fields along with the current user's userId to the service layer
export const profilePostRoute = [
  validation.validateProfile,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const { name, pronouns, bio } = matchedData(req);
    const userId = req.user.id;
    const createdProfile = await profileService.createProfile({name, pronouns, bio, userId});
    if(!createdProfile){
      return res.status(400).json({ error: true, message: "Profile was not created succesfully"});
    }

    res.status(200).json({ message: 'You created a new profile', data: createdProfile});
  }
]

// A route to either:
// Get all the current profiles in the db
// OR redirect to the user's specific profile '/profile/:profilePublicId'
export const profileGetRoute = [
  async(req, res, next) => {
    const profiles = await profileService.fetchAllProfiles();
    if(!profiles){
      return res.status(400).json({ error: true, message: "No Profiles detected"});
    }
    res.status(200).json({ message: "/profile GET route, showing all profiles", data: profiles});
  }
]

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