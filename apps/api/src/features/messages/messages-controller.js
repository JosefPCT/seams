import { validationResult, matchedData } from 'express-validator';

import * as validation from "../../middleware/validation.js"
import * as messagesServices from "./messages-service.js";
import { isAuth, isOwnMessage, isOwnProfile } from "../../middleware/authMiddleware.js";


// Endpoint: POST '/messages?userPublicId={id}
// Route responsible for creating/sending a message
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

// Endpoint: GET '/messages?userPublicId={id}'
// Returns a JSON list of all messages or if userPublicId search query is present filters only messages sent by that user
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

// Endpoint: GET '/messages/:messagePublicId
// Returns a JSON data of a specific message based on it route parameter (:messagePublicId), the message's public id in the database
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

// Endpoint: PUT '/messages/:messagePublicId'
// Updates the content of a specific message based on it route parameter (:messagePublicId), the message's public id in the database
// Also returns a JSON data of the updated message
// Checks if the validated data object is empty, and returns a proper status and message as a JSON
export const messagePutRoute = [
  isAuth,
  isOwnMessage,
  validation.validateUpdateMessage,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    // Checks if the matchedData(req) object is empty
    if(Object.keys(matchedData(req)).length === 0 && matchedData(req).constructor === Object){
      return res.status(401).json({ warning: true, message: "No valid fields to update"})
    }

    const { messagePublicId } = req.params;

    const editedMessage = await messagesServices.updateMessage(matchedData(req), messagePublicId);
    if(!editedMessage){
        return res.status(400).json({ error: true, message: "Editing the message not successful"});
    }
    res.status(200).json({ message: 'PUT /messages/:messagePublicId route', data: editedMessage});
  }
]

// Endpoint: DELETE '/messages/:messagePublicId'
// Deletes a specific message based on it route parameter (:messagePublicId), the message's public id in the database
// Returns a JSON payload information of the deleted message
// Accessible only by a logged in user and if that user owns the message
export const messageDeleteRoute = [
  isAuth,
  isOwnMessage,
  async(req, res, next) => {
    const { messagePublicId } = req.params;
    const deletedMessage = await messagesServices.deleteMessage(messagePublicId);
    if(!deletedMessage){
        return res.status(400).json({ error: true, message: "Deleting the message not successful"});
    }
    res.status(200).json({ message: 'DELETE /messages/:messagePublicId route', data: deletedMessage});
  }
]