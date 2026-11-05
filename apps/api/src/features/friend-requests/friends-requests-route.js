import express from "express";

import * as controller from "./friend-requests-controller.js"

const friendRequestsRouter = express.Router();

friendRequestsRouter.post('/', controller.friendRequestsPostRoute);
friendRequestsRouter.get('/', controller.friendRequestsGetRoute)

// attachmentsRouter.post('/', controller.attachmentsByMessagePostRoute);
// attachmentsRouter.get('/', controller.attachmentsByMessageGetRoute);
// attachmentsRouter.get('/:attachmentPublicId', controller.messageAttachmentGetRoute)

// attachmentsRouter.patch('/:attachmentPublicId', controller.messageAttachmentPatchRoute);
// attachmentsRouter.delete('/:attachmentPublicId', controller.messageAttachmentDeleteRoute)

export default friendRequestsRouter;