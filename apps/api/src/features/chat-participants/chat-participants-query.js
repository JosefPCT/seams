import { prisma } from "@repo/database"

// Helper functions to get internal ids of a resource from their public id

export const getIdOfUserByPublicId = async(targetPublicId) => {
  return await prisma.user.findUnique({
    where: {
      publicId: targetPublicId,
    },
    select: {
      id: true
    }
  })
}

export const getIdOfGroupByPublicId = async(targetPublicId) => {
  return await prisma.chatGroup.findUnique({
    where: {
      publicId: targetPublicId,
    },
    select: {
      id: true
    }
  })
}

// Main Query Functions

export const createChatParticipants = async(data) => {
  return await prisma.chatParticipant.create({
    data: data
  })
}

export const fetchAllChatParticipants = async(whereObj={}) => {
  return await prisma.chatParticipant.findMany({
    where: whereObj
  })
}

export const getChatParticipant = async(targetPublicId) => {
  return await prisma.chatParticipant.findUnique({
    where: {
        publicId: targetPublicId
    }
  })
}

export const deleteChatParticipant = async(targetPublicId) => {
  return await prisma.chatParticipant.delete({
    where: {
      publicId: targetPublicId
    }
  })
}