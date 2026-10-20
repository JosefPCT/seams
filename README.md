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

### /users

#### POST /users
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

Returned Object may include fields of:
- id (public id)
- email
- addtl
- isAdmin

#### GET /users?page={num}&limit={num}&searchTerm={string}&sortBy={validField}&sortOrder={'asc'/'desc'}&include=profile&include=messsages&include=groups
Returns a JSON of a list of users in the database, includes a URL to the user's profile
Optional Search Query Parameters:
- page(number) and
- limit(number) for pagination
- searchTerm (string) for filtering
- sortBy(a valid field to search for) and
    sortBy valid values (id, publicId, email, addtl, isAdmin)
- sortOrder(only two options: asc/desc) for sorting
- include (declared by repeating the include variable to create an array, valid values are: profile, messages, and groups)

Returned Object may include fields of:
- meta:
    - current_page
    - per_page
    - total_records
- links:
    - first
    - prev 
    - self
    - next
    - last
- data:
    - id (public id)
    - email
    - addtl
    - isAdmin
    - profile (relation)
    - messages (relation)
    - groups (relation)
    - _count (number of instances in the relation)
    - links
        - createProfileUrl
        - profileUrl (url to the specific profile attached to this user ('/profile/:publicId'))
        - chatGroupUrl (url to `/chat-groups?userPublicId={id}` with the id of the user passed as search query parameter )
        - messagesUrl (url to `/messages?userPublicId={id}` with the id of the user passed as search query parameter )

#### GET /users/me
Returns a JSON payload of information of the current logged-in user, includes a URL to the user's profile

Returned Object includes only the root level information (Does not include relations), includes links though

#### GET /users/:userPublicId
Returns a JSON payload of information of a user based on the passed :userPublicId, includes a URL to the user's profile
Optional Search Query Parameters:
- include (declared by repeating the include variable to create an array, valid values are: profile, messages, and groups)

Returned Object may include fields of:
- id (public id)
- email
- addtl
- isAdmin
- profile (relation)
- messages (relation)
- groups (relation)
- _count (number of instances in the relation)
- links
    - createProfileUrl (Url to create a profile)
    - profileUrl (url to the specific profile attached to this user ('/profile/:publicId'))
    - chatGroupUrl (url to `/chat-groups?userPublicId={id}` with the id of the user passed as search query parameter )
    - messagesUrl (url to `/messages?userPublicId={id}` with the id of the user passed as search query parameter )


#### PATCH /users/:userPublicId
Updates information of a user based on the passed :userPublicId.
Also returns a JSON payload of information of the updated user with their updated data (minus the sensitive information)
Accepts a req.body of mostly optional:
- email
- password
- confirm_password
- first_name
- last_name
- isAdmin


#### DELETE /users:userPublicId
Deletes a user based on the passed :userPublicId

### /profiles

#### POST /profiles
Creates a profile based on the current user logged in or optionally by the passed search query parameter userPublicId
Accepts a req.body of:
- userPublicId (UUID string)
- name (string)
- pronouns (string)
- bio (string)

Returned object may include fields of:
- id (UUID)
- name (string)
- bio (string)
- pronouns (string)
- createdAt (Date)
- updatedAt (date)
- user (relation)
    - id (UUID)
    - email (email)
    - addtl (String)
    - isAdmin (Boolean, if user is an admin or not)
- links
    - self (link to the actual profile (/profiles/:id))
    - usersUrl (link to the related user)

#### GET /profiles?page={num}&limit={num}&searchTerm={string|UUID}&sortBy={validField}&sortOrder=(asc|desc)&include=user&include=groups
Returns a JSON  of all created profiles if no query is given
If given a query of 'userPublicId', filters the selection of profiles to only display profile/profiles created by a certain user 
Optional Search Query Parameters:
- page(number) and limit(number) for pagination
- searchTerm (string) for filtering, you can also use a UUID instead of a string to look for an exact match of a public ID
- sortBy(a valid field to search for) and sortOrder(only two options: asc/desc) for sorting
    - sortBy valid values (id, publicId, name, pronouns, bio, createdAt, updatedAt)
- include (declared by repeating the include variable to create an array, valid values are: users, groups) 
(To implement: add more includes such as: user's messages (double nested))

Returned Object may include fields of:
- meta:
    - current_page
    - per_page
    - total_records
- links:
    - first
    - prev 
    - self
    - next
    - last
- data:
    - id (public id)
    - name
    - pronouns
    - bio
    - createdAt
    - updatedAt
    - user (relation)
        - id
        - email
        - addtl
        - isAdmin
        - groups (relation)
    - links
        - self
        - usersUrl (url to the specific user attached to this profile ('/users/:publicId'))



#### GET /profiles/:profilePublicId
Returns a JSON of a specific profile based on the route parameter (:profilePublicId) the profile's public id
Optional Search Query Parameters:
- include (declared by repeating the include variable to create an array, valid values are: user, groups)

Returned Object may include fields of:
- id (public id)
- name
- pronouns
- bio
- createdAt
- updatedAt
- user (relation)
    - id
    - email
    - addtl
    - isAdmin
    - groups (relation)
- links
    - self
    - usersUrl (url to the specific user attached to this profile ('/users/:publicId'))


#### PATCH /profiles/:profilePublicId
Updates a profile based on the route parameter(:profilePublicId) the profile's public id
Accessible only by a logged in user and if the user owns the profile.
Also returns a JSON of the updated profile with the new updated information
Accepts a req.body mostly optional:
- name
- pronouns
- bio

Returns a formatted object that removes sensitive fields 

#### DELETE /profiles:profilePublicId
Deletes a profile based on the route parameter(:profilePublicId) the profile's public id
Accessible only by a logged in user and if the user owns the profile


### /messages

#### POST /messages
Create/Sends a new message to a chat, based on the current logged in user
TODO: potentially to refactor to either/or use the current logged in user's public id or pass a userPublicId search query
Accessible only be a logged in user
Returns a JSON payload information of the created/sent message
Accepts a req.body of:
- userPublicId (UUID string)
- content (string)

#### GET /messages?userPublicId={id}
Returns a JSON payload information of the list of all messages in the database, or if passed a search query (userPublicId) filters the list to only show messages sent by the passed user


#### GET /messages/:messagePublicId
Returns a JSON data of a specific message based on it route parameter (:messagePublicId), the message's public id in the database

#### PUT /messages/:messagePublicId
Updates the content of a specific message based on it route parameter (:messagePublicId), the message's public id in the database
Also returns a JSON data of the updated message
Accessible only by a logged in user and if that user owns the message
Accepts a req.body of mostly optional:
- content

#### DELETE /messages/:messagePublicId
Deletes a specific message based on it route parameter (:messagePublicId), the message's public id in the database
Also returns a JSON data of the deleted message
Accessible only by a logged in user and if that user owns the message


### /chat-groups

#### POST /chat-groups

#### GET /chat-groups?searchString=string

#### GET /chat-groups/:chatGroupPublicId

#### PUT /chat-groups/:chatGroupPublicId

#### DELETE /chat-groups/:chatGroupPublicId

### #chat-participants

#### POST /chat-participants

#### POST /chat-participants/batch

#### GET /chat-participants?userPublicId=uuidString&groupPublicId=uuidString

#### GET /chat-participants/:publicId

#### PATCH /chat-participants/:publicID

#### DELETE /chat-participants/:publicID