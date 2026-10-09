import * as customError from "../../utils/extended-errors.js";

import * as chatGroupsQuery from "./chat-groups-query.js";

export const createNewChatGroup = async(data) => {
  let isDataEmpty = false;
  if(Object.keys(data).length === 0 && data.constructor === Object){
    isDataEmpty = true
  }
  const createdChatGroup = isDataEmpty ? await chatGroupsQuery.createChatGroup() : await chatGroupsQuery.createChatGroup(data);
  return createdChatGroup;
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