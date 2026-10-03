
// POST '/users'
// Handles creation of a new user internally (use '/register' for normal registration)
// Decide if using shared service/queries with the `/register' route from auth resource
// TODO: Only accesseble by an admin?
export const usersPostRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "You are in POST '/users' route"});
  }
]

// GET '/users'
// Shows a list of all users
export const usersGetRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "You are in GET '/users' route"});
  }
]

// GET '/users/:userPublicId'
// Show a specific user by their public id
export const userByPublicIdGetRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "You are in GET '/users/:userPublicId' route"});
  }
]

// PUT '/users/:userPublic'
// Update a specific user by their public id
// TODO: Only access if user is updating their own info (password) or user is an admin
export const userPutRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "You are in PUT '/users/:userPublicId' route"});
  }
]

// DELETE '/users/:userPublicId'
// Delete a specific user by their public id
// TODO: Only access if user is deleting their account or user is an admin
export const userDeleteRoute = [
  async(req, res, next) => {
    res.status(200).json({ message: "You are in DELETE '/users/:userPublicId' route"});
  }
]