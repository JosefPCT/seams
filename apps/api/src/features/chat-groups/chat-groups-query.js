import { prisma } from "@repo/database";

export const createChatGroup = async(data) => {
  return await prisma.chatGroup.create({
    data
  })
}