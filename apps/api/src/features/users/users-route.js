import express from "express";

import * as usersController from "./users-controller.js";

const usersRouter = express.Router();

usersRouter.post('/', usersController.usersPostRoute);

usersRouter.get('/', usersController.usersGetRoute);

// Non-standard routes
usersRouter.get('/me', usersController.userMeGetRoute);
usersRouter.get('/online', usersController.usersOnlineGetRoute);
usersRouter.get('/:userPublicId/friends', usersController.userByIdFriendsGetRoute);
usersRouter.get('/:userPublicId/status', usersController.userByIdStatusGetRoute)

usersRouter.get('/:userPublicId', usersController.userByPublicIdGetRoute);

usersRouter.patch('/:userPublicId', usersController.userPatchRoute);

usersRouter.delete('/:userPublicId', usersController.userDeleteRoute);



export default usersRouter;