import { prisma } from "@repo/database";

export const createChatGroup = async(data) => {
  return await prisma.chatGroup.create({
    data
  })
}

export const findAllChatGroups = async(conditionalObj) => {
  return await prisma.chatGroup.findMany(conditionalObj);
}

export const findChatGroupByPublicId = async(targetPublicId) => {
  return await prisma.chatGroup.findUnique({
    where: {
        publicId: targetPublicId
    }
  })
}