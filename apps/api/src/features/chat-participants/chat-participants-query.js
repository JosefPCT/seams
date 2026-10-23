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

export const getTotalChatParticipants = async({searchTerm, isSearchTermUUID, createdWhereObj}) => {
  return await prisma.chatParticipant.findMany({
    where: createdWhereObj,
    select: {
      id: true
    }
  })
}

// Main Query Functions

export const createChatParticipants = async(data) => {
  return await prisma.chatParticipant.create({
    data: data,
    select: {
      publicId: true,
      role: true,
      joinedAt: true,
      user: {
        select: {
          publicId: true,
          email: true,
          addtl: true,
          profile: {
            select: {
              publicId: true,
              name: true
            }
          }
        }
      },
      group: {
        select: {
          publicId: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        }
      }
    }
  })
}

export const createManyChatParticipants = async(data) => {
  return await prisma.chatParticipant.createManyAndReturn({
    data: data,
    skipDuplicates: true, // Optional: skips records that violate unique constraints (relational databases only)
    select: {
      publicId: true,
      role: true,
      joinedAt: true,
      user: {
        select: {
          publicId: true,
          email: true,
          addtl: true,
          profile: {
            select: {
              publicId: true,
              name: true
            }
          }
        }
      },
      group: {
        select: {
          publicId: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        }
      }
    }
  })
}

export const fetchAllChatParticipants = async({take, skip, searchTerm, isSearchTermUUID, createdWhereObj, createdSortObj, createdSelectObj}) => {
  return await prisma.chatParticipant.findMany({
    take: take,
    skip: skip,
    where: createdWhereObj,
    orderBy: createdSortObj,
    select: createdSelectObj
  })
}

export const getChatParticipant = async(targetPublicId) => {
  return await prisma.chatParticipant.findUnique({
    where: {
        publicId: targetPublicId
    }
  })
}

export const updateChatParticipant = async(targetPublicId, data) => {
  return await prisma.chatParticipant.update({
    where: {
      publicId: targetPublicId
    },
    data: data
  })
}

export const deleteChatParticipant = async(targetPublicId) => {
  return await prisma.chatParticipant.delete({
    where: {
      publicId: targetPublicId
    }
  })
}