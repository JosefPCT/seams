import * as participantsQuery from "./chat-participants-query.js";

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
    
  const whereObj = {
    userId: userId && userId.id,
    groupId: groupId && groupId.id
  }

  console.log("The where conditional object");
  console.log(whereObj);

  return await searchQuery ? participantsQuery.fetchAllChatParticipants(whereObj) : participantsQuery.fetchAllChatParticipants()
}