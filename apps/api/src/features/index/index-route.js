import express from "express";

import * as indexController from "./index-controller.js";

const indexRouter = express.Router();

indexRouter.get('/', indexController.indexGetRoute);

export default indexRouter;