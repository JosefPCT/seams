import express from "express";

import attachmentsRouter from "./attachments/attachments-route.js";

import * as messagesController from "./messages-controller.js";

const messagesRouter = express.Router();

messagesRouter.post('/', messagesController.messagesPostRoute);

messagesRouter.get('/', messagesController.messagesGetRoute);

messagesRouter.get('/:messagePublicId', messagesController.messageByPublicIdGetRoute);

messagesRouter.patch('/:messagePublicId', messagesController.messagePatchRoute);

messagesRouter.delete('/:messagePublicId', messagesController.messageDeleteRoute);

messagesRouter.use('/:messagePublicId/attachments', attachmentsRouter);

export default messagesRouter;