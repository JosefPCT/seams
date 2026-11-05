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

#### GET /users?page={num}&limit={num}&searchTerm={string}&sort={string1,string2,-string3}&include=profile&include=messsages&include=groups
Returns a JSON of a list of users in the database, includes a URL to the user's profile
Optional Search Query Parameters:
- page(number) and
- limit(number) for pagination
- searchTerm (string) for filtering
- sort(fields separated by comma, add - symbol if descending, no symbol means ascending) for sorting (i.e sort=name,-createdAt)
    - sort valid values (id, publicId, email, addtl, isAdmin)
    - Sorting priority will depend on what field was declared first (i.e sort=content,-createdAt) content will be the primary sort
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

#### GET /profiles?page={num}&limit={num}&searchTerm={string|UUID}&sort={string1,string2,-string3}&include=user&include=groups
Returns a JSON  of all created profiles if no query is given
If given a query of 'userPublicId', filters the selection of profiles to only display profile/profiles created by a certain user 
Optional Search Query Parameters:
- page(number) and limit(number) for pagination
- searchTerm (string) for filtering, you can also use a UUID instead of a string to look for an exact match of a public ID
- sort(fields separated by comma, add - symbol if descending, no symbol means ascending) for sorting (i.e sort=name,-createdAt)
    - sort valid values (id, publicId, name, pronouns, bio, createdAt, updatedAt)
    - Sorting priority will depend on what field was declared first (i.e sort=content,-createdAt) content will be the primary sort
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


### /friend-requests

#### POST /friend-requests
Create a new friend request, based on the current logged in user
Accessible only be a logged in user
Accepts a req.body of:
- receiverId (UUID string) (public id of the chat group that will the message be sent to)
- senderId (UUID string) (optional) (public id of the user sending the message)
  - Will automatically get the current logged in user's public id if no 'senderId' is detected in the req.body
- status (enum) (optional) (PENDING/ACCEPTED/REJECTED)

Returns a JSON payload information of the created friend request
Returned object may include fields of:
- id (UUID)
- status (string)
- sentAt (Date)
- updatedAt (Date)
- links
    - self (link to the actual friend request) (/friend-requests/:friendRequestId)
    - sender (link to the user that sent the request) ('/users/:userId)
    - receiver (link to the user that received the request) ('/users/:userId)
- sender ( relation: user)
  - id
  - email
  - addtl
- receiver (relation: user)
  - id
  - email
  - addtl

#### GET /friend-requests


### /messages

#### POST /messages
Create/Sends a new message to a chat, based on the current logged in user
TODO: potentially to refactor to either/or use the current logged in user's public id or pass a userPublicId search query
Accessible only be a logged in user
Returns a JSON payload information of the created/sent message
Accepts a req.body of:
- userPublicId (UUID string) (public id of the user sending the message)
- groupPublicId (UUID string) (public id of the chat group that will the message be sent to)
- content (string)
- attachments (multipart form) (files) (optional)
  - Parsed via multer and populates (req.files.attachments) if files are attached


Returned object may include fields of:
- id (UUID)
- content 
- sentAt
- editedAt
- sentBy (relation) (user)
    - id (UUID)
    - email
- group (relation) (chat group)
    - id (UUID)
    - name
- attachments
    - id
    - name
    - size
    - mimeType
    - url
- links
    - self (link to the actual profile (/profiles/:id))
    - sentBy (link to the related user)
    - chatGroup (link to the related chat group)
    - attachments (link to the child attachments)


#### GET /messages?page={num}&limit={num}&searchTerm={string|UUID}&sort={string1,string2,-string3}&include=sentBy&include=group
Returns a JSON payload information of the list of all messages in the database, or if passed a search query (searchTerm) filters the list to only show messages that passes the searchTerm (id or string)
Optional Search Query Parameters:
- page(number) and limit(number) for pagination
- searchTerm (string) for filtering, you can also use a UUID instead of a string to look for an exact match of a public ID
- sort(fields separated by comma, add - symbol if descending, no symbol means ascending) for sorting (i.e sort=name,-createdAt)
    - sort valid values (content, sentAt, editedAt, id)
    - Sorting priority will depend on what field was declared first (i.e sort=content,-createdAt) content will be the primary sort
- include (declared by repeating the include variable to create an array, valid values are: sentBy, group) 
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
    - content
    - sentAt
    - editedAt
    - sentBy (relation (user))
        - id
        - email
        - addtl
        - isAdmin
        - groups (relation)
    - group (relation (chat-group))
        - id
        - name
        - createdAt
        - updatedAt
    - links
        - self
        - sentBy (url to the specific user attached to this message ('/users/:publicId'))
        - group (url to the specific chat group attached to this message)


#### GET /messages/:messagePublicId
Returns a JSON data of a specific message based on it route parameter (:messagePublicId), the message's public id in the database
Optional Search Query Parameters:
- include (declared by repeating the include variable to create an array, valid values are: sentBy, group)

Returned Object may include fields of:
- id (public id)
- content
- sentAt
- editedAt
- sentBy (relation (user))
    - id
    - email
    - addtl
    - isAdmin
    - groups (relation)
- group (relation (chat-group))
    - id
    - name
    - createdAt
    - updatedAt
- attachments
    - id
    - name
    - size
    - mimeType
    - url
- links
    - self
    - sentBy (url to the specific user attached to this message ('/users/:publicId'))
    - group (url to the specific group attached to this messsage)
    - attachments (link to the child attachments)


#### PATCH /messages/:messagePublicId
Updates the content of a specific message based on it route parameter (:messagePublicId), the message's public id in the database
Also returns a JSON data of the updated message
Accessible only by a logged in user and if that user owns the message
IMPORTANT: If you want to update the attachments of the message use ('PATCH /messages/:messageId/attachments/:attachmentId), this route will only update its own data not its child
Accepts a req.body of mostly optional:
- content (string)

NOTE: Can only edit the content, not the connection between the user and the group

Returns a formatted object without sensitive fields


#### DELETE /messages/:messagePublicId
Deletes a specific message based on it route parameter (:messagePublicId), the message's public id in the database
Also returns a JSON message if deletion is successful
Accessible only by a logged in user and if that user owns the message

### /messages/:messagePublicId/attachments

#### POST /messages/:messagePublicId/attachments
Creates an attachment, based on the current logged in user and from the dynamic route parameter (:messagePublicId)
Accessible only be a logged in user
Returns a JSON payload information of the created attachment
Accepts a req.body of:
- attachments (multipart form) (files) (required)
  - Parsed via multer and populates (req.files.attachments) if files are attached
  - This is where we will get most of the other data needed ( size, mimeType, url)
- name (string) (optional)


Returned object may include fields of:
- id (UUID)
- name (string)
- mimeType (string)
- size (int)
- url (public url in the uploaded file in supabase)
- message (relation: message)
    - id
- links
    - self (link to the actual attachment) (/messages/:messageId/attachments/:attachmentId)
    - message (link to the message parent) (/messages/:messageId)

#### GET /messages/:messagePublicId/attachments?page={num}&limit={num}&searchTerm={string|UUID}&sort={string1,string2,-string3}&include=message
Returns a JSON payload information of the list of all attachments of the message parent (:messagePublicId) in the database, or if passed a search query (searchTerm) filters the list to only show attachments that passes the searchTerm (id or string)
Optional Search Query Parameters:
- page(number) and limit(number) for pagination
- searchTerm (string) for filtering, you can also use a UUID instead of a string to look for an exact match of a public ID
- sort(fields separated by comma, add - symbol if descending, no symbol means ascending) for sorting (i.e sort=name,-createdAt)
    - sort valid values (name, url, size, mimeType, uploadedAt, editedAt)
    - Sorting priority will depend on what field was declared first (i.e sort=content,-createdAt) content will be the primary sort
- include (declared by repeating the include variable to create an array, valid values are: message) 

Returned object may include fields of:
- meta
    - current_page
    - per_page
    - total_number_of_pages
    - total_records
- links
    - first
    - prev
    - self
    - next
    - last
- data
    - id (UUID)
    - name (string)
    - mimeType (string)
    - size (int)
    - url (public url in the uploaded file in supabase)
    - uploadedAt
    - editedAt
    - messageParent (relation: message)
        - id
        - content
        - sentAt
        - editedAt
    - links
        - self (link to the actual attachment) (/messages/:messageId/attachments/:attachmentId)
        - message (link to the message parent) (/messages/:messageId)

#### GET /messages/:messagePublicId/attachments/:attachmentPublicId
Returns a JSON data of a specific message attachment based on it route parameter (:messagePublicId) and (:attachmentPublicId), the message and  attachment's public id in the database
Optional Search Query Parameters:
- include (declared by repeating the include variable to create an array, valid values are: message)


Returned object may include fields of:
- id (UUID)
- name (string)
- mimeType (string)
- size (int)
- url (public url in the uploaded file in supabase)
- message (relation: message)
    - id
- links
    - self (link to the actual attachment) (/messages/:messageId/attachments/:attachmentId)
    - message (link to the message parent) (/messages/:messageId)

#### PATCH /messages/:messagePublicId/attachments/:attachmentPublicId
Updates the content of a specific message attachmernt based on it route parameter (:messagePublicId and :attachmentPublicId), the message and attachment's public id in the database
    - Can either update only the name of the attachment (if only passed a 'name' in req.body without new file)
    - Or if a new uploaded file is detected, will update the whole attachment with the new name, size, mimeType, url
Also returns a JSON data of the updated message
Accessible only by a logged in user and if that user owns the message and attachment
Accepts a req.body of mostly optional:
- name (string) (optional)
- and/or attachments (req.files.attachments) (new uploaded file) (optional)


Returned object may include fields of:
- id (UUID)
- name (string)
- mimeType (string)
- size (int)
- url (public url in the uploaded file in supabase)
- message (relation: message)
    - id
- links
    - self (link to the actual attachment) (/messages/:messageId/attachments/:attachmentId)
    - message (link to the message parent) (/messages/:messageId)


#### DELETE /messages/:messagePublicId/attachments/:attachmentPublicId
Deletes a specific message attachment based on it route parameter (:messagePublicId and :attachmentPublicId), the message and attachment's public id in the database
Returns a status message if deletion is successful or not
Accessible only by a logged in user and if that user owns the message

### /chat-groups

#### POST /chat-groups
Create a new chat group
Accessible only be a logged in user
Returns a JSON payload information of the created chat-group
Accepts a req.body of:
- name(string) (optional: will default to 'New chat' if omitted)

Returned object may include fields of:
- id (UUID)
- name
- createdAt
- updatedAt
- links
    - getChatGroup (URL to the specific chat group created)



#### GET /chat-groups?page={num}&limit={num}&searchTerm={string|UUID}&sort={string1,string2,-string3}&include=participants&include=messages
Returns a JSON payload information of the list of all chat groups in the database, or if passed a search query (searchTerm) filters the list to only show chat-groups that passes the criteria
Optional Search Query Parameters:
- page(number) and limit(number) for pagination
- searchTerm (string) for filtering, you can also use a UUID instead of a string to look for an exact match of a public ID
- sort(fields separated by comma, add - symbol if descending, no symbol means ascending) for sorting (i.e sort=name,-createdAt)
    - sort valid values (id, publicId, name, createdAt, updatedAt)
    - Sorting priority will depend on what field was declared first (i.e sort=content,-createdAt) content will be the primary sort
- include (declared by repeating the include variable to create an array, valid values are: participants, messages) 

Returned Object may include fields of:
- meta:
    - current_page
    - per_page
    - total_records
    - total_number_of_pages
- links:
    - first
    - prev 
    - self
    - next
    - last
- data:
    - id (public id)
    - name
    - createdAt
    - updatedAt
    - participants (relation (chat-participants))
        - id
        - role
        - joinedAt
        - user (relation (user))
            - id
            - email
            - addtl
            - profile (relation (profile))
                - id
                - name
    - messages (relation (messages))
        - id
        - content
        - sentAt
        - editedAt
        - sentBy (relation (user))
            - id
            - email
            - profile (relation (profile))
                - id
                - name
    - _count
        - messages
        - participants
    - links
        - self
        - messages (url to the messages attached to this chat group ('/users/:publicId'))
        - participants (url to the participants attached to this chat group)


#### GET /chat-groups/:chatGroupPublicId?include=messages&include=participants
Returns a JSON data of a specific chat-group based on its route parameter (:chatGroupPublicId), the chat group's public id in the database
Optional Search Query Parameters:
- include (declared by repeating the include variable to create an array, valid values are: participants, messages)

Returned Object may include fields of:
- id (public id)
- name
- createdAt
- updatedAt
- participants (relation (chat-participant))
    - id
    - role
    - joinedAt
    - user (relation (user))
        - id
        - email 
        - addtl
        - profile (relation)
            - id
            - name
- messages (relation (message))
    - id
    - content
    - sentAt
    - editedAt
    - sentBy (relation: user)
        - id
        - email
        - addtl
        - profile (relation: profile)
            - id
            - name
- links
    - self
    - sentBy (url to the specific user attached to this message ('/users/:publicId'))
    - group (url to the specific group attached to this messsage)

#### PUT /chat-groups/:chatGroupPublicId
Updates the content of a specific chat group based on it route parameter (:chatGroupPublicId), the chat-group's public id in the database
Also returns a JSON data of the updated chat group
TODO: Accessible only by a logged in user and the user must be an admin/member of the chat-group (chat-participants' role)
Accepts a req.body of mostly optional:
- name (string)

NOTE: Can only update the name of the chat group

Returns a formatted object without sensitive fields, and renamed fields

#### DELETE /chat-groups/:chatGroupPublicId
Deletes a specific chat group based on it route parameter (:chatGroupPublicId), the chat group's public id in the database
Also returns a JSON message if deletion is successful
TODO: Accessible only by a logged in user and the user must be an admin of the chat-group (chat-participants' role)


### #chat-participants

#### POST /chat-participants
Create a new chat participant
TODO: Accessible only be a logged in user and ?
Returns a JSON payload information of the created chat-participant
Accepts a req.body of:
- userPublicId (UUID) (public id of the user that will be a participant on the chat group)
- groupPublicID (UUID) (public id of the group that will have the user participating to)
- role (ADMIN/MEMBER) (optional) (enum, will default to MEMBER if omitted)
- joinedAt (Date) (optional) (will default to the current date now if omitted)

Returned object may include fields of:
- id (UUID)
- role
- joinedAt
- user (relation - user)
    - id
    - email
    - addtl
    - profile (relation - profile)
        - id
        - name
- group (relation - chat group)
    - id
    - name
    - createdAt
    - updatedAt
- links
    - self (url to the GET route of the created chat participant)
    - user (url to user linked)
    - chatGroup (url to the chat group linked)

#### POST /chat-participants/batch
Create a batch of new chat participants
TODO: Accessible only be a logged in user and ?
Returns a JSON payload information (array) of the created chat participants
Accepts a req.body of one field an array:
- participants ( array of objects)
    - { userPublicId (UUID), groupPublicId(UUID), role (ADMIN/MEMBER) (optional), joinedAt (DATE) (optional) }
i.e 
participants: [
  { userPublicId: "12312", groupPublicId: "111", role: "ADMIN" },
  { userPublicId: "332211", groupPublicId: "111", roleL "MEMBER" }
]

Returned array of objects may include fields of:
- id (UUID)
- role
- joinedAt
- user (relation - user)
    - id
    - email
    - addtl
    - profile (relation - profile)
        - id
        - name
- group (relation - chat group)
    - id
    - name
    - createdAt
    - updatedAt
- links
    - self (url to the GET route of the created chat participant)
    - user (url to user linked)
    - chatGroup (url to the chat group linked)

#### GET /chat-participants?page={num}&limit={num}&searchTerm={string|UUID|role}&sort={string1,string2,-string3}&include=user&include=group
Returns a JSON payload information of the list of all chat participants in the database, or if passed a search query (searchTerm) filters the list to only show chat participants that passes the criteria
Optional Search Query Parameters:
- page(number) and limit(number) for pagination
- searchTerm (string) for filtering, you can also use a UUID instead of a string to look for an exact match of a public ID, and an enum role defined in the schema (i.e MEMBER / ADMIN)
- sort(fields separated by comma, add - symbol if descending, no symbol means ascending) for sorting (i.e sort=name,-createdAt)
    - sort valid values (id, publicId, role, joinedAt)
    - Sorting priority will depend on what field was declared first (i.e sort=content,-createdAt) content will be the primary sort
- include (declared by repeating the include variable to create an array, valid values are: participants, messages) 

Returned Object may include fields of:
- meta:
    - current_page
    - per_page
    - total_records
    - total_number_of_pages
- links:
    - first
    - prev 
    - self
    - next
    - last
- data:
    - id (UUID)
    - role
    - joinedAt
    - user (relation - user)
        - id
        - email
        - addtl
        - profile (relation - profile)
            - id
            - name
    - group (relation - chat group)
        - id
        - name
        - createdAt
        - updatedAt
    - links
        - self (url to the GET route of the created chat participant)
        - user (url to user linked)
        - chatGroup (url to the chat group linked)



#### GET /chat-participants/:publicId?include=group&include=user
Returns a JSON data of a specific chat participant based on its route parameter (:publicId), the chat participant's public id in the database
Optional Search Query Parameters:
- include (declared by repeating the include variable to create an array, valid values are: user, group)

Returned Object may include fields of:
- id (public id)
- role
- joinedAt
- user (relation (user))
    - id
    - email
    - addtl
    - profile (relation (profile))
        - id
        - name
- group (relation (group))
    - id
    - name
    - createdAt
    - updatedAt
- links
    - self (url to the GET route of the created chat participant)
    - user (url to user linked)
    - chatGroup (url to the chat group linked)


#### PATCH /chat-participants/:publicID
Updates the content of a specific chat participant based on it route parameter (:publicId), the chat participant's public id in the database
Also returns a JSON data of the updated chat participant
TODO: Accessible only by a logged in user and ?
Accepts a req.body of mostly optional:
- role (enum) (ADMIN/MEMBER)

NOTE: Can only update the role of the chat participant

Returns a formatted object without sensitive fields, and renamed fields

#### DELETE /chat-participants/:publicID
Deletes a specific chat participant based on it route parameter (:publicId), the chat participant's public id in the database
Also returns a JSON message if deletion is successful
TODO: Accessible only by a logged in user and the user must be its own participant?