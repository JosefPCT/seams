import express from "express";

import * as usersController from "./users-controller.js";

const usersRouter = express.Router();

usersRouter.post('/', usersController.usersPostRoute);

usersRouter.get('/', usersController.usersGetRoute);

usersRouter.get('/:profilePublicId', usersController.userByPublicIdGetRoute);

usersRouter.put('/:profilePublicId', usersController.userPutRoute);

usersRouter.delete('/:profilePublicId', usersController.userDeleteRoute);

export default usersRouter;