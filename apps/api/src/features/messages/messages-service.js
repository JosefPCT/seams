
export const sendMessage = async() => {
  try {
    const newMessage = { message: "Test" }
    return newMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getAllMessages = async() => {
  try {
    const messages = { messages: "Test" }
    return messages;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getMessage = async() => {
  try {
    const message = { message: "Test" }
    return message;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const updateMessage = async() => {
  try {
    const updatedMessage = { messages: "Test" }
    return updatedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const deleteMessage = async() => {
  try {
    const deletedMessage = { messages: "Test" }
    return deletedMessage;
  } catch (error) {
    console.log(error);
    throw error;
  }
}