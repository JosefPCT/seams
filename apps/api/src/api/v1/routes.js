import express from "express";

import indexRoutes from "../../features/index/index-route.js";
import authRoutes from "../../features/auth/auth-route.js";
import profileRoutes from "../../features/profile/profile-route.js";

const apiRouter = express.Router();

apiRouter.get('/', (req, res) => {
  res.status(200).json({ name: "frodo"})
})

apiRouter.use('/api/v1', indexRoutes);
apiRouter.use('/api/v1', authRoutes);
apiRouter.use('/api/v1/profile', profileRoutes);

export default apiRouter;