import * as friendRequestsQuery from "./friend-requests-query.js";
import { prepareFriendRequestDataObj, prepareFriendRequestSelectObj, prepareFriendRequestWhereObj, formatFriendRequestObject, formatFriendRequestsArray, prepareMyRequestsWhereObj } from "./friend-requests-utils.js";
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

export const listFriendRequests = async(protocol, host, { userPublicId, targetType: type, targetStatusArr: statusArr, page = 1, limit = 5, searchTerm = "" , sort ="sentAt", includeArr = [] }) => {
  console.log("Showign search term:");
  console.log(searchTerm)
  if(searchTerm){
    console.log("Showing search termm true")
  }
  const user = userPublicId ? await friendRequestsQuery.getUserByPublicIdMinimal(userPublicId) : -1
  if(!user){
    throw new customErrors.BadRequest("No user by this public id")
  }

  const options = {
      take: Number(limit),
      skip: (Number(page) * Number(limit)) - Number(limit),
      createdWhereObj: prepareFriendRequestWhereObj(searchTerm, isValidV4UUID(searchTerm), includeArr, user.id, type, statusArr),
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

export const deleteFriendRequestById = async(targetPublicId) => {
  const friendRequest = await friendRequestsQuery.getFriendRequest(targetPublicId, undefined);
  if(!friendRequest){
    throw new customErrors.BadRequest("No friend request by this public id, delete operation failed");
  }
  const deletedFriendRequest = await friendRequestsQuery.deleteFriendRequest(targetPublicId);
  return deletedFriendRequest;
}

// Non Standard Route

export const getMyRequests = async(protocol, host, { targetUserPublicId: userPublicId, targetType: type, targetStatusArr: statusArr, page = 1, limit = 5, searchTerm = "" , sort ="sentAt", includeArr = [] }) => {
  const user = await friendRequestsQuery.getUserByPublicIdMinimal(userPublicId)
  if(!user){
    throw new customErrors.BadRequest("No user by this public id")
  }

  const options = {
    take: Number(limit),
    skip: (Number(page) * Number(limit)) - Number(limit),
    createdWhereObj: prepareMyRequestsWhereObj(user.id, type, statusArr),
    createdSortObj: createPrismaOrderByObjectArray(sort),
    createdSelectObj: prepareFriendRequestSelectObj(includeArr)
  }

  const myRequests = await friendRequestsQuery.getAllMyRequests(options);
  if(myRequests.length === 0) {
    return [];
  }

  const totalFriendRequests = await friendRequestsQuery.getTotalFriendRequests(options)
  const totalNumberOfPages = totalFriendRequests.length / Number(limit) < 1 ? 1 : Math.ceil(totalFriendRequests.length / Number(limit))

  const formattedRequests = formatFriendRequestsArray(myRequests, protocol, host);
  return {
    meta: {
      "current_page": page,
      "per_page": limit,
      "total_number_of_pages": totalFriendRequests.length > 0 ? totalNumberOfPages : 0,
      "total_records": totalFriendRequests.length,
    },
    links: {
      first: new URL(`/api/v1/friend-requests/my-requests?page=1`, `${protocol}://${host}`),
      prev: Number(page) === 1 ? null: new URL(`/api/v1/friend-requests/my-requests?page=${Number(page) - 1}`, `${protocol}://${host}`),
      self: new URL(`/api/v1/friend-requests/my-requests?page=${page}&limit=${limit}`, `${protocol}://${host}`),
      next: Number(page) >= totalNumberOfPages ? null: new URL(`/api/v1/friend-requests/my-requests?page=${Number(page) + 1}`, `${protocol}://${host}`),
      last: new URL(`/api/v1/friend-requests/my-requests?page=${totalNumberOfPages}`, `${protocol}://${host}`)
    },
    data: formattedRequests
  }
}