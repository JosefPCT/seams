import { prisma } from "@repo/database";


// Helper Queries

export const getTotalChatGroups = async({createdWhereObj}) => {
  return await prisma.chatGroup.findMany({
    where: createdWhereObj,
    select: {
      id: true
    }
  });
}

// Main Queries

export const createChatGroup = async(data) => {
  return await prisma.chatGroup.create({
    data: data,
    select: {
      publicId: true,
      name: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export const findAllChatGroups = async({take, skip, createdWhereObj, createdSortObj, createdSelectObj}) => {
  return await prisma.chatGroup.findMany({
    take: take,
    skip: skip,
    where: createdWhereObj,
    orderBy: createdSortObj,
    select: createdSelectObj
  });
}

export const findChatGroupByPublicId = async(targetPublicId) => {
  return await prisma.chatGroup.findUnique({
    where: {
        publicId: targetPublicId
    },
    include: {
      messages: true,
      participants: true,
      _count: {
        select: { participants: true }
      }
    }
  })
}
export const updateChatGroupByPublicId = async(targetPublicId, data) => {
  return await prisma.chatGroup.update({
    where:{
      publicId: targetPublicId
    },
    data
  })
}

export const deleteChatGroupByPublicId = async(targetPublicId) => {
  return await prisma.chatGroup.delete({
    where: {
      publicId: targetPublicId
    }
  })
}