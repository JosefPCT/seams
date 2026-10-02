import express from "express";

import * as profileController from "./profile-controller.js";

const profileRouter = express.Router();

profileRouter.post('/', profileController.profilePostRoute);

profileRouter.get('/', profileController.profileGetRoute);

profileRouter.get('/:profilePublicId', profileController.specificProfileGetRoute);

profileRouter.put('/:profilePublicId', profileController.specificProfileUpdateRoute);

profileRouter.delete('/:profilePublicId', profileController.specificProfileDeleteRoute);

export default profileRouter;