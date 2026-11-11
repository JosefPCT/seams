import express from "express";

import * as controller from './heartbeat-controller.js';

const router = express.Router();

router.post('/', controller.heartbeatPostRoute);

// router.post('/batch', controller.participantsPostBatchRoute);

// router.get('/', controller.participantsGetRoute);

// router.get('/:publicId', controller.participantByPublicIdRoute);

// router.patch('/:publicId', controller.participantPatchRoute);

// router.delete('/:publicId', controller.participantDeleteRoute);



export default router;