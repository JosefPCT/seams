import express from "express";

import * as chatGroupsController from "./chat-groups-controller.js";

const chatGroupsRouter = express.Router();

chatGroupsRouter.post('/', chatGroupsController.chatGroupsPostRoute);

chatGroupsRouter.get('/', chatGroupsController.chatGroupsGetRoute);

chatGroupsRouter.get('/:chatGroupPublicId', chatGroupsController.chatGroupByPublicIdRoute);

chatGroupsRouter.patch('/:chatGroupPublicId', chatGroupsController.chatGroupPatchRoute);

chatGroupsRouter.delete('/:chatGroupPublicId', chatGroupsController.chatGroupDeleteRoute);



export default chatGroupsRouter;