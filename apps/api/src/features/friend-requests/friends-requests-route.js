import express from "express";

import * as controller from "./friend-requests-controller.js"

const friendRequestsRouter = express.Router();

friendRequestsRouter.post('/', controller.friendRequestsPostRoute);
friendRequestsRouter.get('/', controller.friendRequestsGetRoute)

friendRequestsRouter.get('/:friendRequestPublicId', controller.friendRequestGetRoute)
friendRequestsRouter.patch('/:friendRequestPublicId', controller.friendRequestPatchRoute);
friendRequestsRouter.delete('/:friendRequestPublicId', controller.friendRequestDeleteRoute);


export default friendRequestsRouter;