import * as friendRequestsQuery from "./friend-requests-query.js";
import { prepareFriendRequestDataObj, prepareFriendRequestSelectObj, prepareFriendRequestWhereObj, formatFriendRequestObject, formatFriendRequestsArray } from "./friend-requests-utils.js";
import { createPrismaOrderByObjectArray } from "../../utils/createOrderByObj.js";
import { isValidV4UUID } from "../../utils/stringUtils.js";

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

export const listFriendRequests = async(protocol, host, { page = 1, limit = 5, searchTerm = "" , sort ="sentAt", includeArr = [] }) => {

  const options = {
      take: Number(limit),
      skip: (Number(page) * Number(limit)) - Number(limit),
      createdWhereObj: prepareFriendRequestWhereObj(searchTerm, isValidV4UUID(searchTerm), includeArr),
      createdSortObj: createPrismaOrderByObjectArray(sort),
      createdSelectObj: prepareFriendRequestSelectObj(includeArr)
  }
  
  const friendRequests = await friendRequestsQuery.getAllFriendRequests(options);
  if(friendRequests.length === 0) {
    return [];
  }

  const formattedFriendRequests = formatFriendRequestsArray(friendRequests, protocol, host);

  const totalFriendRequests = await friendRequestsQuery.getTotalFriendRequests(options)
  const totalNumberOfPages = totalFriendRequests.length / Number(limit) < 1 ? 1 : Math.ceil(totalFriendRequests.length / Number(limit))
  

  return {
    meta: {
      "current_page": page,
      "per_page": limit,
      "total_number_of_pages": totalFriendRequests.length > 0 ? totalNumberOfPages : 0,
      "total_records": totalFriendRequests.length,
    },
    links: {
      first: new URL(`/api/v1/friend-requests?page=1`, `${protocol}://${host}`),
      prev: Number(page) === 1 ? null: new URL(`/api/v1/friend-requests?page=${Number(page) - 1}`, `${protocol}://${host}`),
      self: new URL(`/api/v1/friend-requests?page=${page}&limit=${limit}`, `${protocol}://${host}`),
      next: Number(page) >= totalNumberOfPages ? null: new URL(`/api/v1/friend-requests?page=${Number(page) + 1}`, `${protocol}://${host}`),
      last: new URL(`/api/v1/friend-requests?page=${totalNumberOfPages}`, `${protocol}://${host}`)
    },
    data: formattedFriendRequests
  }
}

export const getFriendRequestById = async(protocol, host, targetPublicId, { includeArr }) => {
  const friendRequest = await friendRequestsQuery.getFriendRequest(targetPublicId, prepareFriendRequestSelectObj(includeArr))
  if(!friendRequest){
    return null;
  }
  const formattedFriendRequest = formatFriendRequestObject(friendRequest, protocol, host);
  return formattedFriendRequest;
}

export const updateFriendRequestById = async(protocol, host, targetPublicId, { status }) => {
  const friendRequest = await friendRequestsQuery.getFriendRequest(targetPublicId, prepareFriendRequestSelectObj([]));
  if(!friendRequest){
    throw new customErrors.BadRequest("No friend request by this public id, delete operation failed");
  }

  const updatedFriendRequest = await friendRequestsQuery.updateFriendRequest(targetPublicId, status, prepareFriendRequestSelectObj([]));
  const formattedFriendRequest = formatFriendRequestObject(updatedFriendRequest, protocol, host);
  return formattedFriendRequest;
}