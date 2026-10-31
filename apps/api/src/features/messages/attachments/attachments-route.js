import express from "express";

import * as controller from "./attachments-controller.js";

const attachmentsRouter = express.Router({ mergeParams: true });

attachmentsRouter.post('/', controller.attachmentsByMessagePostRoute);
attachmentsRouter.get('/', controller.attachmentsByMessageGetRoute);
attachmentsRouter.get('/:attachmentPublicId', controller.messageAttachmentGetRoute)

attachmentsRouter.patch('/:attachmentPublicId', controller.messageAttachmentPatchRoute);
attachmentsRouter.delete('/:attachmentPublicId', controller.messageAttachmentDeleteRoute)

export default attachmentsRouter;