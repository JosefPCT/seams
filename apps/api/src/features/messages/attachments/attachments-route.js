import express from "express";

import * as controller from "./attachments-controller.js";

const attachmentsRouter = express.Router({ mergeParams: true });

attachmentsRouter.post('/', controller.attachmentsByMessagePostRoute);
attachmentsRouter.get('/', controller.attachmentsByMessageGetRoute);
attachmentsRouter.get('/:attachmentPublicId', controller.messageAttachmentGetRoute)

export default attachmentsRouter;