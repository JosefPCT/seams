import express from "express";

import * as controller from './chat-participants-controller.js'

const router = express.Router();

router.post('/', controller.participantsPostRoute);

router.get('/', controller.participantsGetRoute);

// router.get('/:publicId', controller.participantByPublicIdRoute);

// router.put('/:publicId', controller.participantPutRoute);

router.delete('/:publicId', controller.participantDeleteRoute);



export default router;