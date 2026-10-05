import * as messagesServices from "./messages-service.js";

// Route responsible for creating a message
// TODO: Make sure to attach the correct user and correct chatgroupid
// Might need to also create the chat group if new chat?
export const messagesPostRoute = [
  async(req, res, next) => {

    const createdMessage = await messagesServices.sendMessage();
    if(!createdMessage){
        return res.status(400).json({ error: true, message: "Message was not sent successfully"});
    }

    res.status(200).json({ message: 'You sent a new message', data: createdMessage});
  }
]

export const messagesGetRoute = [
  async(req, res, next) => {

    const messages = await messagesServices.getAllMessages();
    if(!messages){
        return res.status(400).json({ error: true, message: "No messages yet"});
    }
        
    res.status(200).json({ message: 'GET /messages?userPublicId={id}&chatPublicId={id} route ', data: messages});
  }
]

export const messageByPublicIdGetRoute = [
  async(req, res, next) => {

    const message = await messagesServices.getMessage();
    if(!message){
        return res.status(400).json({ error: true, message: "No messages with this particular public id"});
    }

    res.status(200).json({ message: 'GET /messages/:messagePublicId route ', data: message})
  }
]

export const messagePutRoute = [
  async(req, res, next) => {

    const editedMessage = await messagesServices.updateMessage();
    if(!editedMessage){
        return res.status(400).json({ error: true, message: "Editing the message not successful"});
    }
    res.status(200).json({ message: 'PUT /messages/:messagePublicId route', data: editedMessage});
  }
]

export const messageDeleteRoute = [
  async(req, res, next) => {
    const deletedMessage = await messagesServices.deleteMessage();
    if(!deletedMessage){
        return res.status(400).json({ error: true, message: "Deleting the message not successful"});
    }
    res.status(200).json({ message: 'DELETE /messages/:messagePublicId route', data: deletedMessage});
  }
]