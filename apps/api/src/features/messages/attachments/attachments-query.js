import { prisma } from "@repo/database"

// Helper queries

export const getMessageByPublicId = async(messagePublicId) => {
  return await prisma.message.findUnique({
    where: {
      publicId: messagePublicId,
    },
    select: {
      id: true,
    }
  })
}

// Main Query


export const createAttachment = async({ messageId, name, mimeType, size, url}) => {
  return await prisma.attachment.create({
    data: {
      messageId: messageId,
      name: name,
      mimeType: mimeType,
      size: size,
      url: url
    },
    select: {
      publicId: true,
      name: true,
      mimeType: true,
      size: true,
      url: true,
      message: {
        select: {
          publicId: true
        }
      }
    }
  })
}