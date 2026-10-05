import express from "express";

import indexRoutes from "../../features/index/index-route.js";
import authRoutes from "../../features/auth/auth-route.js";
import usersRouter from "../../features/users/users-route.js";
import profilesRoutes from "../../features/profiles/profiles-route.js";

const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  res.status(200).json({ name: "frodo"})
})

apiRouter.use('/api/v1', indexRoutes);
apiRouter.use('/api/v1', authRoutes);
apiRouter.use('/api/v1/users', usersRouter);
apiRouter.use('/api/v1/profile', profilesRoutes);

export default apiRouter;