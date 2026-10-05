
export const createMessage = async() => {
  return { message: "Created message"}
}

export const fetchAllMessages = async() => {
  return { messages: "Getting all messages"}
}

export const fetchMessageByPublicId = async() => {
  return { message: 'Get specific message'}
}

export const updateMessageByPublicId = async() => {
  return { message: 'Update specific messsage '}
}

export const deleteMessageByPublicId = async() => {
  return { message: "Delete specific message"}
}