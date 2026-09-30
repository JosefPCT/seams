import express from "express";

import * as authController from "./auth-controller.js";

const authRouter = express.Router();

authRouter.post('/register', authController.registerPostRoute);

export default authRouter;