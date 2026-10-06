# seams
A messaging app where users can send messages with each other, includes a user profile, sending images, a friend list which you can add people and see which friend is online, add friends to group chats

# seams/api
Serves at the backend API with urls such as:



# /api/v1 API prefix
- Prefixed routes to indicate api version

## Non-standard Endpoints

### POST /register
Registers a user to access authorized routes
Accepts a required req.body of:
- email
- password
- confirm_password
Optional:
- first_name
- last_name
- addtl
- isAdmin

### POST /login
Handles authenticating a user for them to access protected routes
Accepts a req.body of:
- email (custom)
- password (default)

### GET /logout
Handles de-authentication of a user to disable them access of protected routes

## Standard Endpoints

### POST /users
Handles creation of a new user internally instead of the normal '/register'.
Returns a JSON payload of information of the created user.
Accepts req.body of:
- email
- password
- confirm_password
- first_name
- last_name
Optional:
- isAdmin

### GET /users
Returns a JSON of a list of users in the database, includes a URL to the user's profile

### GET /users/me
Returns a JSON payload of information of the current logged-in user, includes a URL to the user's profile

### GET /users/:userPublicId
Returns a JSON payload of information of a user based on the passed :userPublicId, includes a URL to the user's profile

### PUT /users/:userPublicId
Updates information of a user based on the passed :userPublicId.
Also returns a JSON payload of information of the updated user with their updated data.
Accepts a req.body of mostly optional:
- email
- password
- confirm_password
- first_name
- last_name
- isAdmin

### DELETE /users:userPublicId
Deletes a user based on the passed :userPublicId
Also returns a JSON payload of information of the deleted user.