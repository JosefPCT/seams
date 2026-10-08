import { prisma } from "@repo/database"

// Helper Queries

export const findUserByEmail = async(targetEmail) => {
  return await prisma.user.findUnique({
    where: {
      email: targetEmail
    }
  });
}

export const findUserByPublicId = async(targetUserPublicId) => {
  return await prisma.user.findUnique({
    where: {
      publicId: targetUserPublicId
    },
    include: {
        profile: true,
        messages: true
    }
  })
}


// Main Queries

export const createNewUser = async(userData) => {
  return await prisma.user.create({
    data: {
      id: 1,
      email: userData.email,
      hash: userData.hash,
      addtl: userData.first_name
    }
  })
}

export const fetchAllUsers = async() => {
  return await prisma.user.findMany();
}

export const fetchCurrentUserByPublicId = async(targetPublicId) => {
  return await prisma.user.findUnique({
    where: {
      publicId: targetPublicId
    },
    include: {
      profile: true,
      messages: true
    }
  })
}

export const updateUserByPublicId = async(userPublicId, data) => {
  return await prisma.user.update({
    where: {
      publicId: userPublicId
    },
    data
  })
}

export const deleteUserByPublicId = async(targetUserPublicId) => {
  return await prisma.user.delete({
    where: {
      publicId: targetUserPublicId
    }
  })
}