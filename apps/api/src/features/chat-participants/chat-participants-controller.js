import { matchedData, validationResult } from "express-validator";

import * as service from "./chat-participants-service.js";
import { isAuth } from "../../middleware/authMiddleware.js";
import * as validation from "../../middleware/validation.js";

export const participantsPostRoute = [
  validation.validateCreateParticipant,
  async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    const { userPublicId, groupPublicId, role, joinedAt } = matchedData(req);
    const result = await service.createChatParticipants( req.protocol, req.get('host'), {userPublicId, groupPublicId, role, joinedAt});
    if(!result){
        return res.status(400).json({ error: true, message: "Participant not created successfully"});
    }
    res.status(201).json({ status: "Ok", message: "In 'POST /chat-participants'", data: result});
  }
]

// A specific route to create participants in a batch
// Accepts a req.body of one field "participants" which should have an array of objects that has fields of (required: 'userPublicId', 'groupPublicId' and optional: 'role', 'joinedAt')
export const participantsPostBatchRoute = [
  validation.validateCreateBatchParticipants,
  async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const { participants } = matchedData(req);
    const result = await service.createBatchChatParticipants( req.protocol, req.get('host'), { participants })

    res.status(201).json({ status: "ok", message: "In 'POST /chat-participants/batch'", data: result})
  }
]

export const participantsGetRoute = [
  async(req, res) => {
    const { page, limit, searchTerm, sort, include } = req.query;
    const includeArr = Array.isArray(include) ?  include : [include].filter(Boolean);
    const result = await service.listChatParticipants(req.protocol, req.get('host'), { page, limit, searchTerm, sort, includeArr} );
    
    res.status(200).json({ status: "Ok", message: "In 'GET /chat-participants'", data: result});
  }
]

export const participantByPublicIdRoute = [
  async(req, res) => {
    const { publicId } = req.params;
    
    const result = await service.getChatParticipant(publicId)
    res.status(200).json({ status: "ok", message: "In 'GET /chat-participants/:publicId'", data: result})
  }
]

// Only patch a single field for now: 'role'
export const participantPatchRoute = [
  validation.validatePatchParticipant,
  async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    const { publicId } = req.params;
    const { role } = matchedData(req)

    const result = await service.patchChatParticipant(publicId, { role })
    res.status(200).json({ status: "ok", message: "In 'PATCH /chat-participants/:publicId'", data: result})
  }
]

export const participantDeleteRoute = [
  async(req, res) => {
    const { publicId } = req.params;

    const result = await service.deleteChatParticipant(publicId);
    res.status(204).json({ status: 'Ok', message: "In 'DELETE /chat-participants", data: result});
  }
]