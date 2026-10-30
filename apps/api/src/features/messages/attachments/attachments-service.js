import * as attachmentQueries from "./attachments-query.js";
import * as customErrors from "../../../utils/extended-errors.js";
import * as attachmentsUtils from "./attachments-utils.js";

export const createAttachment = async({ name, attachments }, userPublicId, messagePublicId, protocol, host) => {
  
  const messageParent = await attachmentQueries.getMessageByPublicId(messagePublicId);
  if(!messageParent){
    throw new customErrors.BadRequest("No message (parent) by this public id")
  }

  await attachmentsUtils.uploadAttachmentsToSupabase(attachments, userPublicId);
  const attachmentsWithUrl = attachmentsUtils.createAttachmentsObjectWithUrl(attachments, userPublicId);

  attachmentsWithUrl[0].messageId = messageParent.id;

  console.log(attachmentsWithUrl[0]);

  const createdAttachment = await attachmentQueries.createAttachment(attachmentsWithUrl[0]);
  const formattedAttachment = attachmentsUtils.formatReturnAttachmentObject(createdAttachment, protocol, host);

  return formattedAttachment;
}