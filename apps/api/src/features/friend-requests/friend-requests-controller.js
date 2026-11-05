import { validationResult, matchedData } from 'express-validator';

import { isAuth } from '../../middleware/authMiddleware.js';
import { validateCreateFriendRequest, validateUpdateFriendRequest } from '../../middleware/validation.js';
import * as services from "./friend-requests-service.js";

export const friendRequestsPostRoute = [
  isAuth,
  validateCreateFriendRequest,
  async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const { receiverId, senderId: possibleSenderId, status} = matchedData(req);
    const senderId = possibleSenderId || req.user.publicId;
    const result = await services.createFriendRequest({ receiverId, senderId, status}, req.protocol, req.get('host'));
    if(!result){
      res.status(400).json({ status: 'error', message: 'Creation of friend request failed'});
    }
    res.status(200).json({ status: "OK", message: "You are in /friend-requests POST route", data: result });
  }
]

export const friendRequestsGetRoute = [
  async(req, res) => {
    const { page, limit, searchTerm, sort, include } = req.query;
    const includeArr = Array.isArray(include) ?  include : [include].filter(Boolean);
    const result = await services.listFriendRequests(req.protocol, req.get('host'), { page, limit, searchTerm, sort, includeArr });
    if(!result){
      return res.status(400).json({ error: true, message: "No friend requests retrieved"});
    }
    res.status(200).json({ status: "OK", message: "You are in /friend-requests GET route, retrieving all friend requests", data: result});
  }
]

export const friendRequestGetRoute = [
  async(req, res) => {
    const { friendRequestPublicId } = req.params;
    const { include } = req.query;
    const includeArr = Array.isArray(include) ?  include : [include].filter(Boolean);
    const result = await services.getFriendRequestById(req.protocol, req.get('host'), friendRequestPublicId, { includeArr });
    if(!result){
      return res.status(400).json({ error: true, message: "No friend request retrieved"});
    }
    res.status(200).json({ status: "OK", message: `You are in /friend-requests/:id (${friendRequestPublicId}) GET route, retrieving a specific friend request`, result: result});
  }
]

export const friendRequestPatchRoute = [
  isAuth,
  validateUpdateFriendRequest,
  async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const { friendRequestPublicId } = req.params;
    const { status } = matchedData(req);

    const result = await services.updateFriendRequestById(req.protocol, req.get('host'), friendRequestPublicId, { status })
    if(!result){
      res.status(400).json({ status: 'error', message: 'Update of friend request failed, something went wrong'});
    }

    res.status(200).json({ status: "OK", message: `You are in PATCH /friend-requests/:id (${friendRequestPublicId}) PATCH route, updated friend request`, result: result});
  }
]