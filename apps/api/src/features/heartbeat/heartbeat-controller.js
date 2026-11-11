import { prisma } from "@repo/database";
import { isAuth } from "../../middleware/authMiddleware.js";

export const heartbeatPostRoute = [
  isAuth,
  async(req, res) => {
    const userPublicId = req.user.publicId;
    console.log("User public id:", userPublicId);

    if(!userPublicId){
      return res.status(400).json({ error: "User Public ID is required"});
    }

    const user = await prisma.user.findUnique({ where: { publicId: userPublicId}});
    console.log("Showing returned user");
    console.log(user);

    if(!user){
      return res.status(400).json({ error: "No user by this public id"});
    }

    console.log("Saving a new date:");
    console.log(new Date());
    console.log(Date.now());
    console.log(new Date(Date.now()))

    try {
      await prisma.user.update({
        where: { publicId: userPublicId },
        data: { lastSeen: new Date() }
      })

      return res.status(200).json({ status: 'Alive heartbeat'})
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update heartbeat' });
    }

    // res.status(200).json({ message: "You are in POST '/heartbeat' route"});
  }
]