import * as messagesQueries from "./messages-queries.js";
import * as usersQueries from "../users/users-queries.js";
import * as customError from "../../utils/extended-errors.js";

// data object includes a field of: content
export const sendMessage = async(data, userPublicId) => {
  try {
    // Checks if user of the passed userPublicId argument exists on the database and to also get the user's internal id to be passed on to the query layer
    const currentUser = await usersQueries.findUserByPublicId(userPublicId)
    if(!currentUser){
      throw new customError.BadRequest(`Invalid user to send messages with`);
    }

    const newMessage = await messagesQueries.createMessage(data, currentUser.id);
    return newMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Gets the user based on the user's public id to retrieve it's internal id
// Passes on the internal id if a search query is present
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

// data object fields include: content
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