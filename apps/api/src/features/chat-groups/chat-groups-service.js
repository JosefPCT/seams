import * as customError from "../../utils/extended-errors.js";
import { isValidV4UUID } from "../../utils/stringUtils.js";
import { createPrismaOrderByObjectArray  } from "../../utils/createOrderByObj.js";
import * as chatGroupUtils from "./chat-groups-utils.js";
import * as chatGroupsQuery from "./chat-groups-query.js";

// Since `name` field has a default value when creating, we can just pass the data object even if its empty(will use default value)
export const createNewChatGroup = async(protocol, host, { name }) => {
  const createdChatGroup = await chatGroupsQuery.createChatGroup( { name });
  const { publicId, ...rest} = createdChatGroup;
  return {
    id: publicId,
    ...rest,
    links: {
      getChatGroup: new URL(`/api/v1/chat-groups/${publicId}`, `${protocol}://${host}`),
    }
  }
}

// Can add filtering, sorting, pagination logic here
export const getAllChatGroups = async(protocol, host, { page=1, limit=5, searchTerm="", sort="createdAt", includeArr=[] }) => {

  const options = {
    take: Number(limit),
    skip: (Number(page) * Number(limit)) - limit,
    createdWhereObj: chatGroupUtils.prepareChatGroupsWhereObj(searchTerm, isValidV4UUID(searchTerm)),
    createdSortObj: createPrismaOrderByObjectArray(sort),
    createdSelectObj: chatGroupUtils.prepareChatGroupSelectObj(includeArr)
  }

  const chatGroups = await chatGroupsQuery.findAllChatGroups(options)

  const formattedChatGroups = chatGroupUtils.formatReturnChatGroupsList(chatGroups, protocol, host)

  const totalChatGroups = await chatGroupsQuery.getTotalChatGroups(options);
  const totalNumberOfPages = totalChatGroups.length / Number(limit) <= 1 ? 1 : Math.ceil(totalChatGroups.length / Number(limit))

  return {
      meta: {
        "current_page": page,
        "per_page": limit,
        "total_number_of_pages": totalNumberOfPages,
        "total_records": totalChatGroups.length,
      },
      links: {
        first: new URL(`/api/v1/chat-groups?page=1`, `${protocol}://${host}`),
        prev: Number(page) === 1 ? null: new URL(`/api/v1/chat-groups?page=${Number(page) - 1}`, `${protocol}://${host}`),
        self: new URL(`/api/v1/chat-groups?page=${page}&limit=${limit}`, `${protocol}://${host}`),
        next: Number(page) >= totalNumberOfPages ? null: new URL(`/api/v1/chat-groups?page=${Number(page) + 1}`, `${protocol}://${host}`),
        last: new URL(`/api/v1/chat-groups?page=${totalNumberOfPages}`, `${protocol}://${host}`)
      },
      data: formattedChatGroups
    }
}

export const getChatGroupByPublicId = async(publicId) => {
  const chatGroup = await chatGroupsQuery.findChatGroupByPublicId(publicId); 
  return chatGroup;
}

export const updateChatGroup = async(publicId, data) => {
  const updatedChatGroup = await chatGroupsQuery.updateChatGroupByPublicId(publicId, data);
  return updatedChatGroup;
}

export const deleteChatGroup = async(publicId) => {
  const deletedChatGroup = await chatGroupsQuery.deleteChatGroupByPublicId(publicId);
  return deletedChatGroup;
}