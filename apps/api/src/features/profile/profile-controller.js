import { isAuth, isOwnProfile } from "../../middleware/authMiddleware.js";
import * as profileService from "./profile-service.js";
import * as validation from "../../middleware/validation.js"

// A route to create a new profile for the user if a profile has not existed yet
export const profilePostRoute = [
  validation.validateProfile,
  async(req, res, next) => {
    res.status(200).json({ message: 'You created a new profile'});
  }
]

// A route to either:
// Get all the current profiles in the db
// OR redirect to the user's specific profile '/profile/:profilePublicId'
export const profileGetRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "Profile get route"});
  }
]

export const specificProfileGetRoute = [
  async(req,res,next) => {
    console.log("Specific Profile of public id:");
    console.log(req.params.profilePublicId);
    res.status(200).json({ id: req.params.profilePublicId});
  }
]

export const specificProfileUpdateRoute = [
  isOwnProfile,
  async(req, res, next) => {
    res.status(200).json({ message: "You are now updating a profile... authorized"})
  }
]

export const specificProfileDeleteRoute = [
  isOwnProfile,
  async(req, res, next) => {
    res.status(200).json({ message: "Deleted your own profile"});
  }
]