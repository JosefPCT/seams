// Helper middleware to use in route handlers to check if user is authenticated
const isAuth = (req, res, next) => {
    // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json( { msg: "You are not authenticated" });
    }
};

export { isAuth }