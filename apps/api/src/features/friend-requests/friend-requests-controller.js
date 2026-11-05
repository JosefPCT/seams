

export const friendRequestsPostRoute = [
  async(req, res) => {
    res.status(200).json({ status: "OK", message: "You are in /friend-requests POST route"});
  }
]