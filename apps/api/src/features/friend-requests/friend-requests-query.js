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

// Main Queries

export const createFriendRequest = async(createdDataObj, createdSelectObj) => {
  return await prisma.friendRequest.create({
    data: createdDataObj,
    select: createdSelectObj
  })
}