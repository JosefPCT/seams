import express from "express";

import * as chatGroupsController from "./chat-groups-controller.js";

const chatGroupsRouter = express.Router();

chatGroupsRouter.post('/', chatGroupsController.chatGroupsPostRoute);

chatGroupsRouter.get('/', chatGroupsController.chatGroupsGetRoute);

chatGroupsRouter.get('/:userPublicId', chatGroupsController.chatGroupByPublicIdRoute);

chatGroupsRouter.put('/:userPublicId', chatGroupsController.chatGroupPutRoute);

chatGroupsRouter.delete('/:userPublicId', chatGroupsController.chatGroupDeleteRoute);



export default chatGroupsRouter;