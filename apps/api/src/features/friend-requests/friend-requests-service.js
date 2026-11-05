import * as friendRequestsQuery from "./friend-requests-query.js";
import { prepareFriendRequestDataObj, prepareFriendRequestSelectObj, formatFriendRequestObject } from "./friend-requests-utils.js";

export const createFriendRequest = async ({ receiverId, senderId, status}, protocol, host) => {
  const targetSenderUser = await friendRequestsQuery.getUserByPublicIdMinimal(senderId)
  if(!targetSenderUser){
    throw new customErrors.BadRequest("No user by this public id")
  }
  const targetReceiverUser = await friendRequestsQuery.getUserByPublicIdMinimal(receiverId)
  if(!targetReceiverUser){
    throw new customErrors.BadRequest("No user by this public id")
  }

  const createdDataObj = prepareFriendRequestDataObj(targetReceiverUser.id, targetSenderUser.id, status);
  const createdSelectObj = prepareFriendRequestSelectObj(['sender', 'receiver']);
  const createdFriendRequest = await friendRequestsQuery.createFriendRequest(createdDataObj, createdSelectObj);
  const formattedFriendRequest = formatFriendRequestObject(createdFriendRequest, protocol, host);

  return formattedFriendRequest
}