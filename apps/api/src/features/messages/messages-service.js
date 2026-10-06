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

export const getAllMessages = async(userPublicId) => {
  try {

    let user;
    // Checks if userPublicId from the req.query is present on the URL
    if(userPublicId){
      user = await usersQueries.findUserByPublicId(userPublicId);
    }

    const messages = user ? await messagesQueries.fetchAllMessages(user.id) : await messagesQueries.fetchAllMessages();
    return messages;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getMessage = async(messagePublicId) => {
  try {
    const message = await messagesQueries.fetchMessageByPublicId(messagePublicId);
    return message;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateMessage = async(data, messagePublicId) => {
  try {
    const message = await messagesQueries.fetchMessageByPublicId(messagePublicId)
    if(!message){
      throw new customError.BadRequest(`Message by this id does not exist, aborting deletion operation`);
    }

    const updatedMessage = await messagesQueries.updateMessageByPublicId(data, messagePublicId);
    return updatedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const deleteMessage = async(messagePublicId) => {
  try {
    const message = await messagesQueries.fetchMessageByPublicId(messagePublicId)
    if(!message){
      throw new customError.BadRequest(`Message by this id does not exist, aborting deletion operation`);
    }

    const deletedMessage = await messagesQueries.deleteMessageByPublicId(messagePublicId);
    return deletedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}