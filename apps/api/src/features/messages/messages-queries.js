import { prisma } from "@repo/database"

// Helper Query Functions

export const findUserByPublicId = async(publicId) => {
  return await prisma.user.findUnique({
    where: {
      publicId: publicId
    },
    select: {
      id: true
    }
  })
}

export const findChatGroupByPublicId = async(publicId) => {
  return await prisma.chatGroup.findUnique({
    where: {
      publicId: publicId
    },
    select: {
      id: true
    }
  })
}

export const getTotalMessages = async ({createdWhereObj}) => {
  return await prisma.message.findMany({
    select: {
      id: true
    },
    where: createdWhereObj
  })
}


// Main Queries
export const createMessage = async(messageData, userId, groupId, createdSelectObj) => {
  return await prisma.message.create({
    data: {
      senderId: userId,
      // Test value to allow creation of message, need to change to actual query (has to create or find the group chat first)
      groupId: groupId,
      content: messageData.content
    },
    select: createdSelectObj
  })
}

export const fetchAllMessages = async({take, skip, searchTerm, isSearchTermUUID, createdWhereObj, createdSortObj, createdSelectObj}) => {
  return await prisma.message.findMany({
    take: take,
    skip: skip,
    where: createdWhereObj,
    orderBy: createdSortObj,
    select: createdSelectObj
  });
  
}

export const fetchMessageByPublicId = async(targetPublicId, selectObj) => {
  return await prisma.message.findUnique({
    where: {
      publicId: targetPublicId
    },
    select: selectObj
  })
}

export const updateMessageByPublicId = async(targetPublicId, data, createdSelectObj) => {
  return await prisma.message.update({
    where: {
      publicId: targetPublicId
    },
    data: data,
    select: createdSelectObj
  })
}

export const deleteMessageByPublicId = async(targetPublicId) => {
  return await prisma.message.delete({
    where: {
      publicId: targetPublicId
    }
  })
}