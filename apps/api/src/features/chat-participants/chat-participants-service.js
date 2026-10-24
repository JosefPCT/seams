import * as participantsQuery from "./chat-participants-query.js";
import { BadRequest } from "../../utils/extended-errors.js";
import { preparePatchData, preparePatchDataAlternative } from "../../utils/organizeDataUtils.js";
import * as participantsUtils from "./chat-participants-utils.js";
import * as customError from "../../utils/extended-errors.js"
import { createPrismaOrderByObjectArray } from "../../utils/createOrderByObj.js";
import { isValidV4UUID } from "../../utils/stringUtils.js";

export const createChatParticipants = async( protocol, host, {userPublicId, groupPublicId, role, joinedAt} ) => {
  
  console.log("Showing public id...");
  console.log(userPublicId)
  const targetUser = await participantsQuery.getIdOfUserByPublicId(userPublicId)
  if(!targetUser){
    throw new customError.BadRequest(`No user with this public id exist in the database`);
  }

  const targetGroup = await participantsQuery.getIdOfGroupByPublicId(groupPublicId)
  if(!targetGroup){
    throw new customError.BadRequest(`No group with this public id exist in the database`);
  }

  const createdDataObject = {
    userId: targetUser.id,
    groupId: targetGroup.id,
    role: role,
    joinedAt: joinedAt
  }
  const createdParticipant = await participantsQuery.createChatParticipants(createdDataObject);
  const formattedParticipant = await participantsUtils.formatReturnParticipantObject(createdParticipant, protocol, host);

  return formattedParticipant;
}

// See controller file to check on what fields the data object have
export const createBatchChatParticipants = async(protocol, host, { participants = [] }) => {

  // An async map function to convert the public ids (UUID) to internal ids (Int)
  const processingData = participants.map(async ({ userPublicId, groupPublicId, ...rest }) => {
    
    const targetUser = await participantsQuery.getIdOfUserByPublicId(userPublicId);
    if(!targetUser){
      throw new customError.BadRequest(`No user with this public id exist in the database`);
    }
    const targetGroup  = await participantsQuery.getIdOfGroupByPublicId(groupPublicId)
    if(!targetGroup){
      throw new customError.BadRequest(`No group with this public id exist in the database`);
    }

    return {
      ...rest,
      userId: targetUser?.id,
      groupId: targetGroup?.id
    }
  });

  // Uses Promise.all to resolve the promises in the async map function
  const promisedData = await Promise.all(processingData)

  const createdBatchData = await participantsQuery.createManyChatParticipants(promisedData);
  const formattedBatchParticipants = await participantsUtils.formatReturnBatchParticipantsArray(createdBatchData, protocol, host);

  console.log("showing formatted batch participants before returning to controller");
  console.log(formattedBatchParticipants)
  return formattedBatchParticipants;
}

// searchQuery object has: userPublicId, groupPublicId
export const listChatParticipants = async( protocol, host, {page = 1, limit = 5 , searchTerm = "", sort="joinedAt", includeArr=[]}) => {
  console.log("Service Layer of `GET /chat-participants'");

  const options = {
    take: Number(limit),
    skip: (Number(page) * Number(limit)) - limit,
    searchTerm,
    isSearchTermUUID: isValidV4UUID(searchTerm),
    createdWhereObj: participantsUtils.prepareChatParticipantsWhereObj(searchTerm, isValidV4UUID(searchTerm)),
    createdSortObj: createPrismaOrderByObjectArray(sort),
    createdSelectObj: participantsUtils.prepareChatParticipantsSelectObj(includeArr)
  }

  const chatParticipants = await participantsQuery.fetchAllChatParticipants(options);
  const formattedParticipants = participantsUtils.formatReturnParticipantsArray(chatParticipants, protocol, host);

  const totalChatParticipants = await participantsQuery.getTotalChatParticipants(options);
  const totalNumberOfPages = totalChatParticipants.length / Number(limit) <= 1 ? 1 : Math.ceil(totalChatParticipants.length / Number(limit))

  return {
      meta: {
        "current_page": page,
        "per_page": limit,
        "total_number_of_pages": totalChatParticipants.length > 0 ? totalNumberOfPages : 0,
        "total_records": totalChatParticipants.length,
      },
      links: {
        first: new URL(`/api/v1/chat-participants?page=1`, `${protocol}://${host}`),
        prev: Number(page) === 1 ? null: new URL(`/api/v1/chat-participants?page=${Number(page) - 1}`, `${protocol}://${host}`),
        self: new URL(`/api/v1/chat-participants?page=${page}&limit=${limit}`, `${protocol}://${host}`),
        next: Number(page) >= totalNumberOfPages ? null: new URL(`/api/v1/chat-participants?page=${Number(page) + 1}`, `${protocol}://${host}`),
        last: new URL(`/api/v1/chat-participants?page=${totalNumberOfPages}`, `${protocol}://${host}`)
      },
      data: formattedParticipants
    }
}

export const getChatParticipant = async(protocol, host, publicId, { includeArr }) => {
  const participant = await participantsQuery.getChatParticipant(publicId, participantsUtils.prepareChatParticipantsSelectObj(includeArr));
  if(!participant){
    throw new customError.NotFound(`Chat group with public id: ${publicId} not found`);
  }
  const formattedParticipant = participantsUtils.formatReturnParticipantObject(participant, protocol, host)
  return formattedParticipant;
}

export const patchChatParticipant = async(protocol, host, publicId, data) => {
  const isValidChatParticipant = await participantsQuery.getChatParticipant(publicId);
  if(!isValidChatParticipant){
    throw BadRequest("This chat participant does not exist");
  }
  const organizedData = preparePatchData(data);

  const updatedParticipant = await participantsQuery.updateChatParticipant(publicId, organizedData, participantsUtils.prepareChatParticipantsSelectObj([]));
  const formattedParticipant = participantsUtils.formatReturnParticipantObject(updatedParticipant, protocol, host)
  return formattedParticipant;

}

export const deleteChatParticipant = async(publicId) => {
  const isValidChatParticipant = await participantsQuery.getChatParticipant(publicId);
  if(!isValidChatParticipant){
    throw BadRequest("This chat participant does not exist");
  }

  const deletedParticipant = await participantsQuery.deleteChatParticipant(publicId)
  return deletedParticipant;
}