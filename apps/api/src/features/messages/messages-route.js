import express from "express";

import * as messagesController from "./messages-controller.js";

const messagesRouter = express.Router();

messagesRouter.post('/', messagesController.messagesPostRoute);

messagesRouter.get('/', messagesController.messagesGetRoute);

messagesRouter.get('/:profilePublicId', messagesController.messageByPublicIdGetRoute);

messagesRouter.put('/:profilePublicId', messagesController.messagePutRoute);

messagesRouter.delete('/:profilePublicId', messagesController.messageDeleteRoute);

export default messagesRouter;