import express from "express";

import * as messagesController from "./messages-controller.js";

const messagesRouter = express.Router();

messagesRouter.post('/', messagesController.messagesPostRoute);

messagesRouter.get('/', messagesController.messagesGetRoute);

messagesRouter.get('/:messagePublicId', messagesController.messageByPublicIdGetRoute);

messagesRouter.put('/:messagePublicId', messagesController.messagePutRoute);

messagesRouter.delete('/:messagePublicId', messagesController.messageDeleteRoute);

export default messagesRouter;