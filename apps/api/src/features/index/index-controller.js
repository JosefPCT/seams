import * as indexService from "./index-service.js";

export const indexGetRoute = [
  async(req, res) => {
    if(req.session.viewCount){
      req.session.viewCount = req.session.viewCount + 1;
    } else {
      req.session.viewCount = 1;
    }
    console.log(req);
    console.log(req.session);
    const user = await indexService.getSampleUser();
    res.status(200).json({ userId: user.id, username: user.username, password: user.hash, addtl: user.addtl });
  }
]