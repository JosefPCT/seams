import { validationResult, matchedData } from 'express-validator';

import { isAuth } from '../../middleware/authMiddleware.js';
import { validateCreateFriendRequest } from '../../middleware/validation.js';
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
    const result = await services.listFriendRequests();
    res.status(200).json({ status: "OK", message: "You are in /friend-requests GET route", data: result});
  }
]