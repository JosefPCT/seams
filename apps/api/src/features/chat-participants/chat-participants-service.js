import * as participantsQuery from "./chat-participants-query.js";
import { BadRequest } from "../../utils/extended-errors.js";
import { preparePatchData, preparePatchDataAlternative } from "../../utils/organizeDataUtils.js";

export const createChatParticipants = async(data) => {
  
  const userId = data.userPublicId ? await participantsQuery.getIdOfUserByPublicId(data.userPublicId) : undefined
  const groupId = data.groupPublicId ? await participantsQuery.getIdOfGroupByPublicId(data.groupPublicId) : undefined

  console.log(`User id: ${userId.id}`);
  console.log(`Group id: ${groupId.id}`)

  const organizedData = {
    userId: userId.id,
    groupId: groupId.id,
    role: data.role,
    joinedAt: data.joinedAt
  }

  console.log(organizedData);

  const createdParticipant = await participantsQuery.createChatParticipants(organizedData);

  return createdParticipant;
}

// See controller file to check on what fields the data object have
export const createBatchChatParticipants = async(data) => {
  console.log(data);

  // An async map function to convert the public ids (UUID) to internal ids (Int)
  const processingData = data.participants.map(async ({ userPublicId, groupPublicId, ...rest }) => {
    
    const user = await participantsQuery.getIdOfUserByPublicId(userPublicId);
    const group  = await participantsQuery.getIdOfGroupByPublicId(groupPublicId)

    return {
      ...rest,
      userId: user?.id,
      groupId: group?.id
    }
  });

  // Uses Promise.all to resolve the promises in the async map function
  const promisedData = await Promise.all(processingData)

  const createdBatchData = await participantsQuery.createManyChatParticipants(promisedData);

  return createdBatchData;
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