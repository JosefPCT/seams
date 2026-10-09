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