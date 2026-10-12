import { matchedData, validationResult } from "express-validator";

import * as service from "./chat-participants-service.js";
import { isAuth } from "../../middleware/authMiddleware.js";
import * as validation from "../../middleware/validation.js";

export const participantsPostRoute = [
  validation.validateCreateParticipant,
  async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    const { userPublicId, groupPublicId, role, joinedAt } = matchedData(req);
    const result = await service.createChatParticipants({userPublicId, groupPublicId, role, joinedAt});
    
    res.status(201).json({ status: "Ok", message: "In 'POST /chat-participants'", data: result});
  }
]

export const participantsGetRoute = [
  async(req, res) => {
    const { userPublicId, groupPublicId } = req.query;
    const result = await service.listChatParticipants({userPublicId, groupPublicId});
    res.status(200).json({ status: "Ok", message: "In 'GET /chat-participants?userPublicId={id}&groupPublicId={id}'", data: result});
  }
]

export const participantDeleteRoute = [
  async(req, res) => {
    const { publicId } = req.params;

    const result = await service.deleteChatParticipant(publicId);
    res.status(204).json({ status: 'Ok', message: "In 'DELETE /chat-participants", data: result});
  }
]