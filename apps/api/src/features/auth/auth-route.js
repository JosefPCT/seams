import express from "express";

import * as authController from "./auth-controller.js";

const authRouter = express.Router();

authRouter.post('/register', authController.registerPostRoute);

authRouter.post('/login', authController.loginPostRoute);

authRouter.get('/login-success', authController.loginSuccessGetRoute);
authRouter.get('/login-failure', authController.loginFailureGetRoute);

authRouter.get('/logout', authController.logoutGetRoute);

authRouter.get('/test-protected-route', authController.testProtectedGetRoute);


export default authRouter;