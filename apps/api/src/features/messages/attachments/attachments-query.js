import { prisma } from "@repo/database";

// Helper queries

export const getMessageByPublicIdMinimalist = async (messagePublicId) => {
  return await prisma.message.findUnique({
    where: {
      publicId: messagePublicId,
    },
    select: {
      id: true,
    },
  });
};

export const getTotalAttachmentsByMessage = async({ createdWhereObj }) => {
  return await prisma.attachment.findMany({
    where: createdWhereObj,
    select: {
      id: true
    }
  })
}

// Main Query

export const createAttachmentByMessage = async ({
  messageId,
  name,
  mimeType,
  size,
  url,
}) => {
  return await prisma.attachment.create({
    data: {
      messageId: messageId,
      name: name,
      mimeType: mimeType,
      size: size,
      url: url,
    },
    select: {
      publicId: true,
      name: true,
      mimeType: true,
      size: true,
      url: true,
      message: {
        select: {
          publicId: true,
        },
      },
    },
  });
};

export const findAllAttachmentsByMessage = async ({
  take,
  skip,
  createdWhereObj,
  createdSelectObj,
  createdSortObj,
}) => {
  return await prisma.attachment.findMany({
    take: take,
    skip: skip,
    where: createdWhereObj,
    orderBy: createdSortObj,
    select: createdSelectObj
  })
};


export const findMessageAttachmentByPublicId = async(messageId, attachmentPublicId, selectObj) => {
  return await prisma.attachment.findUnique({
    where: {
      publicId: attachmentPublicId,
      messageId: messageId
    },
    select: selectObj
  })
}

export const deleteMessageAttachmentByPublicId = async(messageId, attachmentPublicId) => {
  return await prisma.attachment.delete({
    where: {
      publicId: attachmentPublicId,
      messageId: messageId
    },
    select : {
      publicId: true
    }
  })
}