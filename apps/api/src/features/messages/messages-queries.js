import { prisma } from "@repo/database"

export const createMessage = async(messageData, userId) => {
  return await prisma.message.create({
    data: {
      senderId: userId,
      content: messageData.content
    }
  })
}

export const fetchAllMessages = async(targetUserId) => {
  return await prisma.message.findMany({
    where: {
      senderId: targetUserId
    }
  })
}

export const fetchMessageByPublicId = async(targetPublicId) => {
  return await prisma.message.findUnique({
    where: {
      publicId: targetPublicId
    }
  })
}

export const updateMessageByPublicId = async() => {
  return { message: 'Update specific messsage '}
}

export const deleteMessageByPublicId = async() => {
  return { message: "Delete specific message"}
}