import * as customError from "../../utils/extended-errors.js";

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
export const getAllChatGroups = async(searchTarget) => {
  let isSearchEmpty = false;
  let whereObject = { orderBy: { createdAt: 'asc' }};

  // Checks if there is a req.query parameter
  if(!!searchTarget){
    console.log("Search String is not empty")
    whereObject = {
        where: {
            OR: [
                {
                    name: {
                        contains: searchTarget,
                        mode: 'insensitive'
                    }
                }
            ]
        },
        orderBy: {
          createdAt: 'desc'
        }
    }
  }

  const chatGroups = isSearchEmpty ? await chatGroupsQuery.findAllChatGroups() : await chatGroupsQuery.findAllChatGroups(whereObject);
  return chatGroups;
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