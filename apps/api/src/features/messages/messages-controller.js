import { validationResult, matchedData } from 'express-validator';

import * as validation from "../../middleware/validation.js"
import * as messagesServices from "./messages-service.js";
import { isAuth, isOwnMessage, isOwnProfile } from "../../middleware/authMiddleware.js";

import { upload } from '../../config/multer.js';



const uploadMiddleware = upload.fields([{ name: 'avatar', maxCount: 1}, { name: "gallery", maxCount: 8}, { name: 'attachments', maxCount: 2}])

// Endpoint: POST '/messages
// Route responsible for creating/sending a message
// TODO: Make sure to attach the correct user and correct chatgroupid
// Might need to also create the chat group if new chat?
export const messagesPostRoute = [
  isAuth,
  // upload.single("test_file"),
  uploadMiddleware,
  validation.validateMessage,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    // TODO: Might need to also add the public id of a chat group (chatgroupPublicId) and also pass it on to the service when ChatGroup Model is created

    const { userPublicId, groupPublicId , content } = matchedData(req);
    const targetUserPublicId = userPublicId || req.user.publicId;

    const attachments = req.files.attachments && req.files.attachments.length > 0
      ? req.files.attachments.map(file => ({ 
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        buffer: file.buffer
      }))
      : undefined

    const createdMessage = await messagesServices.sendMessage({content, attachments}, targetUserPublicId, groupPublicId, req.protocol, req.get('host'));
    if(!createdMessage){
        return res.status(400).json({ error: true, message: "Message was not sent successfully"});
    }

    res.status(200).json({ message: 'You sent a new message', data: createdMessage});

    // // Testing of storing a file to supabase and getting the url from it (cloud storage)
    // const createdMessage = "";
    // console.log("Showing data for POST /messages");
    // console.log("Req body:");
    // console.log(req.body);
    // console.log(req.body.avatar);
    // console.log("Req file:")
    // console.log(req.files);

    // console.log("Avatar:")
    // console.log(req.files.avatar);
    // console.log("Gallery:")
    // console.log(req.files.gallery);
    // console.log("Attachments");
    // console.log(req.files.attachments);

    // console.log("Created object from attachments:");
    // const testCreate = req.files.gallery.map(file => ({
    //   name: file.originalname,
    //   size: file.size,
    //   type: file.mimetype,
    //   buffer: file.buffer
    // }))
    // console.log(testCreate);

    // const folderPath = req.user.publicId;
    // const fileName = req.files.avatar[0].originalname;
    // const filePath = `${folderPath}/${fileName}`;
 
    // console.log(folderPath);
    // console.log(fileName)
    // console.log(filePath)

    // const { data, error } = await supabase.storage.from('testbuck1').upload(filePath, req.files.avatar[0].buffer, {
    //     cacheControl: '3600',
    //     upsert: false,
    //     // contentType: 'image/png',
    //     contentType: req.files.avatar[0].mimetype
    // });

    // console.log("Data:")
    // console.log(data);

    // const { data: publicUrlData , error: getError } = await supabase.storage.from('testbuck1').getPublicUrl(filePath);
    // console.log("Public URL data: ");
    // console.log(publicUrlData);

    // // console.log("Req files")
    // // console.log(req.files.avatar[0].originalname);

    // res.status(200).json({ message: 'You sent a new message', data: createdMessage});
  }
]

// Endpoint: GET '/messages?userPublicId={id}'
// Returns a JSON list of all messages or if userPublicId search query is present filters only messages sent by that user
export const messagesGetRoute = [
  async(req, res, next) => {
    const { page, limit, searchTerm, sort, include } = req.query;
    const includeArr = Array.isArray(include) ?  include : [include].filter(Boolean);
    const messages = await messagesServices.getAllMessages({ page, limit, searchTerm, sort, includeArr}, req.protocol, req.get('host'));
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
    const { include } = req.query;
    const includeArr = Array.isArray(include) ?  include : [include].filter(Boolean);
    const message = await messagesServices.getMessage(req.protocol, req.get('host'), {messagePublicId, includeArr});
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
export const messagePatchRoute = [
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
    const { content } = matchedData(req)

    const editedMessage = await messagesServices.updateMessage(req.protocol, req.get('host'), messagePublicId, { content } );
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
    res.status(200).json({ message: 'DELETE /messages/:messagePublicId route, deleting successful'});
  }
]