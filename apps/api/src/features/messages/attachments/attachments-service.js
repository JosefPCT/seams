import * as attachmentQueries from "./attachments-query.js";
import * as customErrors from "../../../utils/extended-errors.js";
import * as attachmentsUtils from "./attachments-utils.js";

import { isValidV4UUID } from "../../../utils/stringUtils.js";
import { createPrismaOrderByObjectArray } from "../../../utils/createOrderByObj.js";

export const createAttachmentByMessage = async({ name, attachments }, userPublicId, messagePublicId, protocol, host) => {
  
  const messageParent = await attachmentQueries.getMessageByPublicId(messagePublicId);
  if(!messageParent){
    throw new customErrors.BadRequest("No message (parent) by this public id")
  }

  await attachmentsUtils.uploadAttachmentsToSupabase(attachments, userPublicId);
  const attachmentsWithUrl = attachmentsUtils.createAttachmentsObjectWithUrl(attachments, userPublicId);

  attachmentsWithUrl[0].messageId = messageParent.id;

  console.log(attachmentsWithUrl[0]);

  const createdAttachment = await attachmentQueries.createAttachment(attachmentsWithUrl[0]);
  const formattedAttachment = attachmentsUtils.formatReturnAttachmentObject(createdAttachment, messagePublicId, protocol, host);

  return formattedAttachment;
}

export const listAttachmentsByMessage = async(protocol, host, messagePublicId, { page = 1, limit = 5, searchTerm = "" , sort ="uploadedAt", includeArr = [] }) => {
  
  const messageParent = await attachmentQueries.getMessageByPublicId(messagePublicId);
  if(!messageParent){
    throw new customErrors.BadRequest("No message (parent) by this public id")
  }

  const options = {
    take: Number(limit),
    skip: (Number(page) * Number(limit)) - Number(limit),
    createdWhereObj: attachmentsUtils.prepareAttachmentsWhereObj(messageParent.id, searchTerm, isValidV4UUID(searchTerm), includeArr),
    createdSortObj: createPrismaOrderByObjectArray(sort),
    createdSelectObj: attachmentsUtils.prepareAttachmentSelectObj(includeArr)
  }

  const attachments = await attachmentQueries.findAllAttachmentsByMessage(options);
  
  if(attachments.length === 0) {
    return [];
  }

  const formattedAttachments = await attachmentsUtils.formatReturnAttachmentsArray(attachments, messagePublicId, protocol, host);

  const totalAttachments = await attachmentQueries.getTotalAttachmentsByMessage(options);
  const totalNumberOfPages = totalAttachments.length / Number(limit) < 1 ? 1 : Math.ceil(totalAttachments.length / Number(limit));

  return {
    meta: {
      "current_page": page,
      "per_page": limit,
      "total_number_of_pages": totalAttachments.length > 0 ? totalNumberOfPages : 0,
      "total_records": totalAttachments.length,
    },
    links: {
      first: new URL(`/api/v1/messages/${messagePublicId}/attachments?page=1`, `${protocol}://${host}`),
      prev: Number(page) === 1 ? null: new URL(`/api/v1/messages/${messagePublicId}/attachments?page=${Number(page) - 1}`, `${protocol}://${host}`),
      self: new URL(`/api/v1/messages/${messagePublicId}/attachments?page=${page}&limit=${limit}`, `${protocol}://${host}`),
      next: Number(page) >= totalNumberOfPages ? null: new URL(`/api/v1/messages/${messagePublicId}/attachments?page=${Number(page) + 1}`, `${protocol}://${host}`),
      last: new URL(`/api/v1/messages/${messagePublicId}/attachments?page=${totalNumberOfPages}`, `${protocol}://${host}`)
    },
    data: formattedAttachments
  }
}