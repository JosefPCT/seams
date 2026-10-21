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

export const getTotalMessages = async () => {
  return await prisma.message.findMany({
    select: {
      id: true
    }
  })
}


// Main Queries
export const createMessage = async(messageData, userId, groupId) => {
  return await prisma.message.create({
    data: {
      senderId: userId,
      // Test value to allow creation of message, need to change to actual query (has to create or find the group chat first)
      groupId: groupId,
      content: messageData.content
    },
    select: {
      publicId: true,
      content: true,
      sentAt: true,
      editedAt: true,
      sentBy: {
        select: {
          publicId: true,
          email: true,
        }
      },
      group: {
        select: {
          publicId: true,
          name: true
        }
      }
    }
  })
}

export const fetchAllMessages = async({take, skip, searchTerm, isSearchTermUUID, createdSortObj, createdSelectObj}) => {
  return await prisma.message.findMany({
    take: take,
    skip: skip,
    where: {
      OR: [
        { publicId: isSearchTermUUID ? searchTerm: undefined },
        { content: { contains: searchTerm, mode: 'insensitive'}},
        {
          sentBy: isSearchTermUUID
            ? {
                is: {
                  publicId: searchTerm,
                },
              }
            : undefined,
        },
        {
          group: isSearchTermUUID
            ? {
              is: {
                publicId: searchTerm,
              }
            } : undefined
        },
        {
          sentBy: { is: {
            email: { contains: searchTerm, mode: 'insensitive'}
          }}
        },
        {
          sentBy: { is: {
            addtl: { contains: searchTerm, mode: 'insensitive'}
          }}
        },
        {
          group: { is: {
            name: { contains: searchTerm, mode: 'insensitive'}
          }}
        }
      ],
    },
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

export const updateMessageByPublicId = async(data, targetPublicId) => {
  return await prisma.message.update({
    where: {
      publicId: targetPublicId
    },
    data
  })
}

export const deleteMessageByPublicId = async(targetPublicId) => {
  return await prisma.message.delete({
    where: {
      publicId: targetPublicId
    }
  })
}