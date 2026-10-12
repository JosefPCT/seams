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

export const fetchAllChatParticipants = async(whereObj={}) => {
  return await prisma.chatParticipant.findMany({
    where: whereObj
  })
}