import * as indexService from "./index-service.js";

export const indexGetRoute = [
  async(req, res) => {
    const user = await indexService.getSampleUser();
    res.status(200).json({ userId: user.id, username: user.username, password: user.hash, addtl: user.addtl });
  }
]