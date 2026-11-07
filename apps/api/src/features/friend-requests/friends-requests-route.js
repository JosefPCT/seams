import express from "express";

import * as controller from "./friend-requests-controller.js"

const friendRequestsRouter = express.Router();

friendRequestsRouter.post('/', controller.friendRequestsPostRoute);
friendRequestsRouter.get('/', controller.friendRequestsGetRoute)

// Non-standard route to get requests specific to the logged in user (uses req.user)
friendRequestsRouter.get('/my-requests', controller.friendRequestMyRequestsGetRoute);

friendRequestsRouter.get('/:friendRequestPublicId', controller.friendRequestGetRoute)
friendRequestsRouter.patch('/:friendRequestPublicId', controller.friendRequestPatchRoute);
friendRequestsRouter.delete('/:friendRequestPublicId', controller.friendRequestDeleteRoute);


export default friendRequestsRouter;