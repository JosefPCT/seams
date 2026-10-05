import express from "express";

import * as profilesController from "./profiles-controller.js";

const profilesRouter = express.Router();

profilesRouter.post('/', profilesController.profilesPostRoute);

profilesRouter.get('/', profilesController.profilesGetRoute);

profilesRouter.get('/:profilePublicId', profilesController.specificProfileGetRoute);

profilesRouter.put('/:profilePublicId', profilesController.specificProfileUpdateRoute);

profilesRouter.delete('/:profilePublicId', profilesController.specificProfileDeleteRoute);

export default profilesRouter;