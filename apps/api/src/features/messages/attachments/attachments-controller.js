import { validationResult, matchedData } from 'express-validator';

import { isAuth } from "../../../middleware/authMiddleware.js";
import { upload } from "../../../config/multer.js";
import { validateCreateAttachment } from "../../../middleware/validation.js";

import * as services from "./attachments-service.js";

const uploadMiddleware = upload.fields([{ name: 'attachments', maxCount: 2}])

// Should accept a req.body of: name along with the req.params of messagePublicId to get the internal id for the `messageId` scalar field, parses the file attach for the other data needed
export const attachmentsPostRoute = [
  isAuth,
  uploadMiddleware,
  validateCreateAttachment,
  async(req, res) => {
    if(!(req.files && req.files.attachments)){
      res.status(400).json({ message: 'No uploaded file'})
    }

    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json(errors);
    }

    const { name } = matchedData(req);
    const { messagePublicId } = req.params; 
    const userPublicId = req.user.publicId;

    const attachments = req.files.attachments && req.files.attachments.length > 0
      ? req.files.attachments.map(file => ({ 
        name: name || file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        buffer: file.buffer
      }))
      : undefined

    const result = await services.createAttachment({ name, attachments }, userPublicId, messagePublicId, req.protocol, req.get('host') );
    if(!result){
      res.status(400).json({ status: 'error', message: 'Creation of attachment failed'});
    }

    res.status(200).json({ message: 'You attached an attachment on a message', messagePublicId, data: result});
  }
]