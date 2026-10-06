// Helper functions

const checkAdminStatus = (user) => {
  return user.isAdmin
}


// Helper middleware to use in route handlers to check if user is authenticated
const isAuth = (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json( { msg: "You are not authenticated" });
    }
};

const isUserNoProfile = (req, res, next) => {
  !req.user.profile ? next() : res.status(401).json({ message: "User already has a profile"});
}

const isOwnProfile = (req,res, next) => {

  req.user ? 
    req.user.profile.publicId === req.params.profilePublicId ? 
    next() : res.status(401).json({ message: 'You are not authorized to do this'}) 
  : res.status(401).json({ message: "You are not logged in"});

}

const isOwnMessage = (req, res, next) => {
  const { messagePublicId } = req.params;
  let flag = false;
  req.user.messages.forEach(message => {
    if(message.publicId === messagePublicId){
      flag = true;
      return;
    }
  });
  flag ? next() : res.status(401).json({ message: "You are not authorized to do this"});
}

const isAdmin = (req, res, next) => {
  req.user.isAdmin ? next() : res.status(401).json({ message: "You are not an admin"});
}

const isAdminOrIsOwnUserData = (req, res, next) => {
  const { userPublicId } = req.params;
  if(!req.user){
    res.status(401).json({ message: "You are not logged in"});
  } else {
    req.user.isAdmin || req.user.publicId === userPublicId ? next() :  res.status(401).json({ message: "You are not authorized to do this"});
  }
}

export { isAuth, isOwnProfile, isAdmin, isAdminOrIsOwnUserData, isUserNoProfile, isOwnMessage }