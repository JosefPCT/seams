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

export const getTotalUsers = async({createdWhereObj}) => {
  return await prisma.user.findMany({
    where: createdWhereObj,
    select: {
      id: true
    }
  })
}


// Main Queries

// userData object has email, hash, first_name, last_name, isAdmin
export const createNewUser = async(userData, createdSelectObj) => {
  return await prisma.user.create({
    data: {
      email: userData.email,
      hash: userData.hash,
      addtl: `${userData.first_name} ${userData.last_name}`,
      isAdmin: userData.isAdmin
    },
    select: createdSelectObj
  })
}

// Will ignore undefined field and/or field values
// Takes in an options object and a select object as an argument
export const fetchAllUsers = async({take, skip, searchTerm, isSearchTermUUID, createdWhereObj, createdSortObj, createdSelectObj}) => {
  return await prisma.user.findMany({
    take: take,
    skip: skip,
    where: createdWhereObj,
    orderBy: createdSortObj,
    select: createdSelectObj
  });
}

export const fetchUserByPublicId = async(targetPublicId, createdSelectObj) => {
  return await prisma.user.findUnique({
    where: {
      publicId: targetPublicId
    },
    select: createdSelectObj
  })
}

export const updateUserByPublicId = async(userPublicId, data, createdSelectObj) => {
  return await prisma.user.update({
    where: {
      publicId: userPublicId
    },
    data: data,
    select: createdSelectObj
  })
}

export const deleteUserByPublicId = async(targetUserPublicId) => {
  return await prisma.user.delete({
    where: {
      publicId: targetUserPublicId
    }
  })
}

// For non-standard routes

// Used the query for /users/:userId instead 
// export const getUserFriendRequestRelation = async(userPublicId) => {
//   return await prisma.user.findUnique({
//     where: {
//       publicId: true
//     }, 
//     select: {
//       publicId: true,
//       email: true,
//       addtl: true,
//       profile: {
//         select: {
//           publicId: true,

//         }
//       }
//     }
//   })
// }