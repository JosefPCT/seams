import { validationResult, matchedData } from 'express-validator';

import * as validation from "../../middleware/validation.js"
import * as messagesServices from "./messages-service.js";
import { isAuth } from "../../middleware/authMiddleware.js";


// Route responsible for creating a message
// TODO: Make sure to attach the correct user and correct chatgroupid
// Might need to also create the chat group if new chat?

export const messagesPostRoute = [
  isAuth,
  validation.validateMessage,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    // TODO: Might need to also add the public id of a chat group (chatgroupPublicId) and also pass it on to the service when ChatGroup Model is created
    // DECIDE: If we want to accept a req.query to get the userPublicId (/messages?userPublicId={id}) or we just want the current logged in user to send only their messages
    const { userPublicId } = req.query;
    // const targetUserPublicId = userPublicId || req.user.publicId;
    const targetUserPublicId = req.user.publicId;
    const createdMessage = await messagesServices.sendMessage(matchedData(req), targetUserPublicId);
    if(!createdMessage){
        return res.status(400).json({ error: true, message: "Message was not sent successfully"});
    }

    res.status(200).json({ message: 'You sent a new message', data: createdMessage});
  }
]

export const messagesGetRoute = [
  async(req, res, next) => {
    const { userPublicId } = req.query;
    const messages = await messagesServices.getAllMessages(userPublicId);
    if(!messages){
        return res.status(400).json({ error: true, message: "No messages yet"});
    }
        
    res.status(200).json({ message: 'GET /messages?userPublicId={id}&chatPublicId={id} route ', data: messages});
  }
]

export const messageByPublicIdGetRoute = [
  async(req, res, next) => {
    const { messagePublicId } = req.params;
    const message = await messagesServices.getMessage(messagePublicId);
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
    const { messagePublicId } = req.params;
    const deletedMessage = await messagesServices.deleteMessage(messagePublicId);
    if(!deletedMessage){
        return res.status(400).json({ error: true, message: "Deleting the message not successful"});
    }
    res.status(200).json({ message: 'DELETE /messages/:messagePublicId route', data: deletedMessage});
  }
]