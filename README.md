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


### POST /profiles?userPublicId={id}
Creates a profile based on the current user logged in or optionally by the passed search query parameter userPublicId
Accepts a req.body of:
- name
- pronouns
- bio

### GET /profiles?userPublicId={id}
Returns a JSON  of all created profiles if no query is given
If given a query of 'userPublicId', filters the selection of profiles to only display profile/profiles created by a certain user 

### GET /profiles/:profilePublicId
Returns a JSON of a specific profile based on the route parameter (:profilePublicId) the profile's public id

### PUT /profiles/:profilePublicId
Updates a profile based on the route parameter(:profilePublicId) the profile's public id
Accessible only by a logged in user and if the user owns the profile.
Also returns a JSON of the updated profile with the new updated information
Accepts a req.body mostly optional:
- name
- pronouns
- bio

### DELETE /profiles:profilePublicId
Deletes a profile based on the route parameter(:profilePublicId) the profile's public id
Accessible only by a logged in user and if the user owns the profile
Also returns a JSON of the deleted profile

### POST /messages?userPublicId={id}

### GET /messages?userPublicId={id}

### PUT /messages?userPublicId={id}

### DELETE /messages?userPublicId={id}