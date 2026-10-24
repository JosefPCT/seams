import { validationResult, matchedData } from 'express-validator';

import * as validation from "../../middleware/validation.js";
import { isAuth } from "../../middleware/authMiddleware.js";
import * as service from "./chat-groups-service.js";

// 'POST /chat-groups'
// TODO FUTURE: Might need to add a search query to pass on the two initial users/chat members (or need to do in on the message resource)
// A chat group just need to be made and get their id/public id
export const chatGroupsPostRoute = [
  isAuth,
  validation.validateCreateChatGroup,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }
    const { name } = matchedData(req);
    const createdChatGroup = await service.createNewChatGroup(req.protocol, req.get('host'), {name});
    if(!createdChatGroup){
      res.status(400).json({ status: "error", message: "Something unexpected occurred when creating the chat group"});
    }

    res.status(201).json({ status: "success", message: "In 'POST /chat-groups', Chat Group Created!", data: createdChatGroup});
  }
]

// 'GET /chat-groups?page={num}&limit={num}&searchTerm={string|UUID}&sort={string1,string2,-string3}&include=messages&include=participants
// Accepts optional req.query: page, limit, searchTerm, sort, include
export const chatGroupsGetRoute = [
  async(req, res, next) => {
    const { page, limit, searchTerm, sort, include } = req.query;
    const includeArr = Array.isArray(include) ?  include : [include].filter(Boolean);

    const chatGroups = await service.getAllChatGroups(req.protocol, req.get('host'), { page, limit, searchTerm, sort, includeArr });

    res.status(200).json({ status: "success", message: "In 'GET /chat-groups', Here are the list of chat groups", data: chatGroups})
  }
]

// 'GET /chat-groups/:chatGroupPublicId'
export const chatGroupByPublicIdRoute = [
  async(req, res, next) => {
    const { chatGroupPublicId } = req.params;
    const { include } = req.query;
    const includeArr = Array.isArray(include) ?  include : [include].filter(Boolean);
    const chatGroup = await service.getChatGroupByPublicId(chatGroupPublicId, req.protocol, req.get('host'), { includeArr });
    if(!chatGroup){
      res.status(404).json({ status: "not found", message: `Chat group with public id of ${chatGroupPublicId} is not found`, data: chatGroup})
    }
    res.status(200).json({ status: "success", message: `In 'GET /chat-groups/${chatGroupPublicId}', Here is the chat group data`, data: chatGroup})
  }
]

// TODO: add a authorization middleware that checks if the one accessing the route is a member/admin role of the chat-participant on this chat-group
export const chatGroupPatchRoute = [
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

    const { name } = matchedData(req)

    const updatedChatGroup = await service.updateChatGroup(req.protocol, req.get('host'), chatGroupPublicId, { name })

    res.status(200).json({ status: "success", message: `In 'PATCH /chat-groups/${chatGroupPublicId}', Here is the updated chat group data`, data: updatedChatGroup});
  }
]

export const chatGroupDeleteRoute = [
  async(req, res, next) => {
    const { chatGroupPublicId } = req.params;
    const deletedChatGroup = await service.deleteChatGroup(chatGroupPublicId);
    if(!deletedChatGroup){
      return res.status(400).json({ error: true, message: "Deleting the chat-group not successful"});
    }
    res.status(200).json({ status: "success", message: `In 'DELETE /chat-groups/${chatGroupPublicId}, Delete chat group successful operation`});
  }
]