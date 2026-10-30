import { isAuth } from "../../../middleware/authMiddleware";

export const attachmentsPostRoute = [
  isAuth,
  async(req, res) => {
    res.status(200).json({ message: 'You attached an attachment on a message'});
  }
]