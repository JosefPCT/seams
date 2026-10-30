import express from "express";

import * as controller from "./attachments-controller.js";

const attachmentsRouter = express.Router({ mergeParams: true });

attachmentsRouter.post('/', controller.attachmentsPostRoute);

export default attachmentsRouter;