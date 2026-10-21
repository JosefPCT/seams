import * as messagesQueries from "./messages-queries.js";
import { createPrismaOrderByObjectArray } from "../../utils/createOrderByObj.js";
import { isValidV4UUID } from "../../utils/stringUtils.js";
import { prepareMessageSelectObject, formatReturnMessagesList, formatReturnMessageObject } from "./messages-utils.js";
import * as customError from "../../utils/extended-errors.js";

// data object includes a field of: content
export const sendMessage = async (data, userPublicId, groupPublicId, protocol, host) => {
  // Checks if user of the passed userPublicId argument exists on the database and to also get the user's internal id to be passed on to the query layer
  const currentUser = await messagesQueries.findUserByPublicId(userPublicId);
  if (!currentUser) {
    throw new customError.BadRequest(`Invalid user to send messages with`);
  }
  const targetGroup = await messagesQueries.findChatGroupByPublicId(groupPublicId);
  if (!targetGroup) {
    throw new customError.BadRequest(`Invalid group to send message on`);
  }

  const newMessage = await messagesQueries.createMessage(
    data,
    currentUser.id,
    targetGroup.id,
  );

  const { publicId: messagePublicIdAlias, sentBy, group , ...message} = newMessage;
  const { publicId: userPublicIdAlias, ...restOfSentBy} = sentBy;
  const { publicId: groupPublicIdAlias, ...restOfGroup} = group;
  return {
    id: messagePublicIdAlias,
    ...message,
    sentBy: {
      id: userPublicIdAlias,
      ...restOfSentBy
    },
    group: {
      id: groupPublicIdAlias,
      ...restOfGroup
    },
    links: {
      self: new URL(`/api/v1/messages/${messagePublicIdAlias}`, `${protocol}://${host}`),
      sentBy: new URL(`/api/v1/users/${userPublicIdAlias}`, `${protocol}://${host}`),
      chatGroup: new URL(`/api/v1/chat-groups/${groupPublicIdAlias}`, `${protocol}://${host}`),
    }
  }
};

// Gets the user based on the user's public id to retrieve it's internal id
// Passes on the internal id if a search query is present
export const getAllMessages = async({page = 1, limit = 5 , searchTerm = "", sort="sentAt", includeArr=[]}, protocol, host) => {

  const options = {
    take: Number(limit),
    skip: (Number(page) * Number(limit)) - Number(limit),
    searchTerm,
    isSearchTermUUID: isValidV4UUID(searchTerm),
    createdSortObj: createPrismaOrderByObjectArray(sort),
    createdSelectObj: prepareMessageSelectObject(includeArr),
  }

  const messages = await messagesQueries.fetchAllMessages(options)

  if(messages.length === 0) {
    return [];
  }

  const formattedMessages = await formatReturnMessagesList(messages, protocol, host)

  const totalMessages = await messagesQueries.getTotalMessages();
  const totalNumberOfPages = totalMessages.length / Number(limit) < 1 ? 1 : Math.ceil(totalMessages.length / Number(limit))
  return {
    meta: {
      "current_page": page,
      "per_page": limit,
      "total_records": totalMessages.length,
    },
    links: {
      first: new URL(`/api/v1/messages?page=1`, `${protocol}://${host}`),
      prev: Number(page) === 1 ? null: new URL(`/api/v1/messages?page=${Number(page) - 1}`, `${protocol}://${host}`),
      self: new URL(`/api/v1/messages?page=${page}&limit=${limit}`, `${protocol}://${host}`),
      next: Number(page) >= totalNumberOfPages ? null: new URL(`/api/v1/messages?page=${Number(page) + 1}`, `${protocol}://${host}`),
      last: Number(page) === totalNumberOfPages ? null: new URL(`/api/v1/messages?page=${totalNumberOfPages}`, `${protocol}://${host}`)
    },
    data: formattedMessages
  }

}

export const getMessage = async(protocol, host, { messagePublicId, includeArr}) => {
  const message = await messagesQueries.fetchMessageByPublicId(messagePublicId, prepareMessageSelectObject(includeArr));
  const formattedMessage = formatReturnMessageObject(message, protocol, host);
  return formattedMessage;
}

// data object fields include: content
export const updateMessage = async(data, messagePublicId) => {
  try {
    const message = await messagesQueries.fetchMessageByPublicId(messagePublicId)
    if(!message){
      throw new customError.BadRequest(`Message by this id does not exist, aborting deletion operation`);
    }

    const updatedMessage = await messagesQueries.updateMessageByPublicId(data, messagePublicId);
    return updatedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const deleteMessage = async(messagePublicId) => {
  try {
    const message = await messagesQueries.fetchMessageByPublicId(messagePublicId)
    if(!message){
      throw new customError.BadRequest(`Message by this id does not exist, aborting deletion operation`);
    }

    const deletedMessage = await messagesQueries.deleteMessageByPublicId(messagePublicId);
    return deletedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}