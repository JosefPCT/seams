import * as participantsQuery from "./chat-participants-query.js";
import { BadRequest } from "../../utils/extended-errors.js";
import { preparePatchData, preparePatchDataAlternative } from "../../utils/organizeDataUtils.js";
import * as participantsUtils from "./chat-participants-utils.js";
import * as customError from "../../utils/extended-errors.js"

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
  const formattedParticipant = await participantsUtils.formatReturnCreatedParticipantObject(createdParticipant, protocol, host);

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
  const formattedBatchParticipants = await participantsUtils.formatReturnCreatedBatchParticipantsArray(createdBatchData, protocol, host);

  console.log("showing formatted batch participants before returning to controller");
  console.log(formattedBatchParticipants)
  return formattedBatchParticipants;
}

// searchQuery object has: userPublicId, groupPublicId
export const listChatParticipants = async(searchQuery) => {
  console.log("Service Layer of `GET /chat-participants'");

  const userId = searchQuery && searchQuery.userPublicId ? await participantsQuery.getIdOfUserByPublicId(searchQuery.userPublicId) : undefined;
  const groupId = searchQuery && searchQuery.groupPublicId ? await participantsQuery.getIdOfGroupByPublicId(searchQuery.groupPublicId) : undefined;
//   console.log(`User id:`, userId)
//   return userId;

  if(userId === null){
    throw Error("No user with that public id");
  }

  if(groupId === null){
    throw Error("No group with that public id");
  }
    
  const whereObj = {
    userId: userId && userId.id !== null && userId.id || undefined,
    groupId: groupId && groupId.id
  }

  console.log("The where conditional object");
  console.log(whereObj);

  return await searchQuery ? participantsQuery.fetchAllChatParticipants(whereObj) : participantsQuery.fetchAllChatParticipants()
}

export const getChatParticipant = async(publicId) => {
  const participant = await participantsQuery.getChatParticipant(publicId);
  return participant;
}

export const patchChatParticipant = async(publicId, data) => {

  const isValidChatParticipant = await participantsQuery.getChatParticipant(publicId);
  if(!isValidChatParticipant){
    throw BadRequest("This chat participant does not exist");
  }

  const organizedData = preparePatchData(data);
//   console.log("Organized Data");
//   console.log(organizedData);

  const updatedParticipant = await participantsQuery.updateChatParticipant(publicId, organizedData);
  return updatedParticipant;

}

export const deleteChatParticipant = async(publicId) => {
  const isValidChatParticipant = await participantsQuery.getChatParticipant(publicId);
  if(!isValidChatParticipant){
    throw BadRequest("This chat participant does not exist");
  }

  const deletedParticipant = await participantsQuery.deleteChatParticipant(publicId)
  return deletedParticipant;
}