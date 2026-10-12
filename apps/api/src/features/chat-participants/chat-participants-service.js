import * as participantsQuery from "./chat-participants-query.js";
import { BadRequest } from "../../utils/extended-errors.js";

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

export const deleteChatParticipant = async(publicId) => {
  const isValidPublicId = await participantsQuery.getChatParticipant(publicId);
  if(!isValidPublicId){
    throw BadRequest("This public id is not valid")
  }

  const deletedParticipant = await participantsQuery.deleteChatParticipant(publicId)
  return deletedParticipant;
}