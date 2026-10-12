import * as participantsQuery from "./chat-participants-query.js";

// quuery object has: userPublicId, groupPublicId
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