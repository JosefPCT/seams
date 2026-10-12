
export const participantsPostRoute = [
  async(req, res) => {
    res.status(201).json({ status: "Ok", message: "In 'POST /chat-participants' "});
  }
]

export const participantsGetRoute = [
  async(req, res) => {
    res.status(200).json({ status: "Ok", message: "In 'GET /chat-participants?userPublicId={id}&groupPublicId={id}'"});
  }
]