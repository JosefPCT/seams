import { prisma } from "@repo/database";

export const createChatGroup = async(data) => {
  return await prisma.chatGroup.create({
    data
  })
}

export const findAllChatGroups = async(whereOrObject) => {
  return await prisma.chatGroup.findMany({
    where: whereOrObject
  });
}