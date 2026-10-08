import { validationResult, matchedData } from 'express-validator';

import * as validation from "../../middleware/validation.js";
import { isAuth } from "../../middleware/authMiddleware.js";
import * as chatGroupsService from "./chat-groups-service.js";

// 'POST /chat-groups'
export const chatGroupsPostRoute = [
  async(req, res, next) => {
    const createdChatGroup = {};
    res.status(201).json({ status: "success", message: "In 'POST /chat-groups', Chat Group Created!", data: createdChatGroup});
  }
]

// 'GET /chat-groups'
export const chatGroupsGetRoute = [
  async(req, res, next) => {
    const chatGroups = {};
    res.status(200).json({ status: "success", message: "In 'GET /chat-groups', Here are the list of chat groups", data: chatGroups})
  }
]

// 'GET /chat-groups/:chatGroupPublicId'
export const chatGroupByPublicIdRoute = [
  async(req, res, next) => {
    const { chatGroupPublicId } = req.params;
    const chatGroup = {};
    res.status(200).json({ status: "success", message: `In 'GET /chat-groups/${chatGroupPublicId}', Here is the chat group data`, data: chatGroup})
  }
]

export const chatGroupPutRoute = [
  async(req, res, next) => {
    const { chatGroupPublicId } = req.params;
    const updatedChatGroup = {};
    res.status(200).json({ status: "success", message: `In 'PUT /chat-groups/${chatGroupPublicId}', Here is the updated chat group data`, data: updatedChatGroup});
  }
]

export const chatGroupDeleteRoute = [
  async(req, res, next) => {
    const { chatGroupPublicId } = req.params;
    const deletedChatGroup = {};
    res.status(200).json({ status: "success", message: `In 'DELETE /chat-groups/${chatGroupPublicId}, Here is the deleted chat group data:`, data: deletedChatGroup});
  }
]