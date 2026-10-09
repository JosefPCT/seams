import { validationResult, matchedData } from 'express-validator';

import * as validation from "../../middleware/validation.js";
import { isAuth } from "../../middleware/authMiddleware.js";
import * as service from "./chat-groups-service.js";

// 'POST /chat-groups'
// TODO FUTURE: Might need to add a search query to pass on the two initial users/chat members (or need to do in on the message resource)
// A chat group just need to be made and get their id/public id
export const chatGroupsPostRoute = [
  validation.validateCreateChatGroup,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }
    const createdChatGroup = await service.createNewChatGroup(matchedData(req));
    // const createdChatGroup = {}
    res.status(201).json({ status: "success", message: "In 'POST /chat-groups', Chat Group Created!", data: createdChatGroup});
  }
]

// 'GET /chat-groups?searchString={string}'
export const chatGroupsGetRoute = [
  async(req, res, next) => {
    const { searchString } = req.query ;
    const chatGroups = await service.getAllChatGroups(searchString);
    res.status(200).json({ status: "success", message: "In 'GET /chat-groups', Here are the list of chat groups", data: chatGroups})
  }
]

// 'GET /chat-groups/:chatGroupPublicId'
export const chatGroupByPublicIdRoute = [
  async(req, res, next) => {
    const { chatGroupPublicId } = req.params;
    const chatGroup = await service.getChatGroupByPublicId(chatGroupPublicId);
    if(!chatGroup){
      res.status(404).json({ status: "not found", message: `Chat group with public id of ${chatGroupPublicId} is not found`, data: chatGroup})
    }
    res.status(200).json({ status: "success", message: `In 'GET /chat-groups/${chatGroupPublicId}', Here is the chat group data`, data: chatGroup})
  }
]

export const chatGroupPutRoute = [
  validation.validateUpdateChatGroup,
  async(req, res, next) => {
    const { chatGroupPublicId } = req.params;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }
    if(Object.keys(matchedData(req)).length === 0 && matchedData(req).constructor === Object){
      res.status(400).json({ status: 'warning', message: `No valid fields to update`});
    }
    const updatedChatGroup = await service.updateChatGroup(chatGroupPublicId, matchedData(req))

    res.status(200).json({ status: "success", message: `In 'PUT /chat-groups/${chatGroupPublicId}', Here is the updated chat group data`, data: updatedChatGroup});
  }
]

export const chatGroupDeleteRoute = [
  async(req, res, next) => {
    const { chatGroupPublicId } = req.params;
    const deletedChatGroup = await service.deleteChatGroup(chatGroupPublicId);
    res.status(200).json({ status: "success", message: `In 'DELETE /chat-groups/${chatGroupPublicId}, Here is the deleted chat group data:`, data: deletedChatGroup});
  }
]