import * as messagesQueries from "./messages-queries.js";

export const sendMessage = async() => {
  try {
    const newMessage = await messagesQueries.createMessage();
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