import { prisma } from "@repo/database"

// Helper Queries

export const findUserByEmail = async(targetEmail) => {
  return await prisma.user.findUnique({
    where: {
      email: targetEmail
    }
  });
}

export const findUserByPublicId = async(targetUserPublicId, selectObj) => {
  return await prisma.user.findUnique({
    where: {
      publicId: targetUserPublicId
    },
    select: selectObj
  })
}

export const getAllUsersLength = async() => {
  return await prisma.user.findMany({
    select: {
      id: true
    }
  })
}


// Main Queries

// userData object has email, hash, first_name, last_name, isAdmin
export const createNewUser = async(userData) => {
  return await prisma.user.create({
    data: {
      email: userData.email,
      hash: userData.hash,
      addtl: `${userData.first_name} ${userData.last_name}`,
      isAdmin: userData.isAdmin
    },
    select: {
      publicId: true,
      email: true,
      addtl: true,
      isAdmin: true,
    }
  })
}

// Will ignore undefined field and/or field values
// Takes in an options object and a select object as an argument
export const fetchAllUsers = async({take, skip, searchTerm, sortOrder, sortBy}, selectObj) => {
  return await prisma.user.findMany({
    take: take,
    skip: skip,
    where: {
      OR: [
        { email: { contains: searchTerm, mode: 'insensitive'}},
        { addtl: { contains: searchTerm, mode: 'insensitive'}},
        { profile: { is: {
          name: { contains: searchTerm, mode: 'insensitive'},
          pronouns: { contains: searchTerm, mode: 'insensitive'},
          bio: { contains: searchTerm, mode: 'insensitive'}
        }}}
      ]
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    select: selectObj
  });
}

export const fetchUserByPublicId = async(targetPublicId, selectObj) => {
  return await prisma.user.findUnique({
    where: {
      publicId: targetPublicId
    },
    select: selectObj
  })
}

export const updateUserByPublicId = async(userPublicId, data) => {
  return await prisma.user.update({
    where: {
      publicId: userPublicId
    },
    data: data,
    select: {
      publicId: true,
      email: true,
      addtl: true,
      isAdmin: true,
    }
  })
}

export const deleteUserByPublicId = async(targetUserPublicId) => {
  return await prisma.user.delete({
    where: {
      publicId: targetUserPublicId
    }
  })
}