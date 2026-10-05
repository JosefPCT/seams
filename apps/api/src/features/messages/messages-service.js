import * as messagesQueries from "./messages-queries.js";
import * as usersQueries from "../users/users-queries.js";
import * as customError from "../../utils/extended-errors.js";

export const sendMessage = async(data, userPublicId) => {
  try {
    const currentUser = await usersQueries.findUserByPublicId(userPublicId)
    if(!currentUser){
      throw new customError.BadRequest(`Invalid user to send messages with`);
    }

    // Places the internal id of the user to the profile data object
    console.log("Showing data validated");
    console.log(data);

    const newMessage = await messagesQueries.createMessage(data, currentUser.id);
    return newMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getAllMessages = async() => {
  try {
    const messages = await messagesQueries.fetchAllMessages();
    return messages;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getMessage = async() => {
  try {
    const message = await messagesQueries.fetchMessageByPublicId();
    return message;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateMessage = async() => {
  try {
    const updatedMessage = await messagesQueries.updateMessageByPublicId();
    return updatedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const deleteMessage = async() => {
  try {
    const deletedMessage = await messagesQueries.deleteMessageByPublicId();
    return deletedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}