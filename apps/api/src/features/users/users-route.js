import express from "express";

import * as usersController from "./users-controller.js";

const usersRouter = express.Router();

usersRouter.post('/', usersController.usersPostRoute);

usersRouter.get('/', usersController.usersGetRoute);

usersRouter.get('/me', usersController.userMeGetRoute);

usersRouter.get('/:userPublicId', usersController.userByPublicIdGetRoute);

usersRouter.put('/:userPublicId', usersController.userPutRoute);

usersRouter.delete('/:userPublicId', usersController.userDeleteRoute);



export default usersRouter;