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
  if(!searchTarget){
    console.log("Search String is empty")
  }
  const whereOrObject = {
    OR: [
        {
          name: {
            contains: searchTarget,
            mode: 'insensitive'
          }
        }
    ]
  }
  const chatGroups = isSearchEmpty ? await chatGroupsQuery.findAllChatGroups() : await chatGroupsQuery.findAllChatGroups(whereOrObject);
  return chatGroups;
}

