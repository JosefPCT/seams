import { prisma } from "@repo/database";
// Helper Queries

export const getUserByPublicIdMinimal = async(targetPublicId) => {
  return await prisma.user.findUnique({
    where: {
      publicId: targetPublicId
    },
    select: {
      id: true
    }
  })
}

export const getTotalFriendRequests = async({createdWhereObj}) => {
  return await prisma.friendRequest.findMany({
    where: createdWhereObj,
    select: {
      id: true
    }
  })
}

// Main Queries

export const createFriendRequest = async(createdDataObj, createdSelectObj) => {
  return await prisma.friendRequest.create({
    data: createdDataObj,
    select: createdSelectObj
  })
}

export const getAllFriendRequests = async({ take, skip, createdWhereObj, createdSortObj, createdSelectObj}) => {
  return await prisma.friendRequest.findMany({
    take: take,
    skip: skip,
    where: createdWhereObj,
    orderBy: createdSortObj,
    select: createdSelectObj
  });
}

export const getFriendRequest = async(targetPublicId, createdSelectObj) => {
  return await prisma.friendRequest.findUnique({
    where: {
      publicId: targetPublicId
    },
    select: createdSelectObj
  })
}