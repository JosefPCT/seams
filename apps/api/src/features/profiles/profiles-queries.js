import { prisma } from "@repo/database"


// Helper Queries

export const getProfileByUserId = async(userId) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userId
    }
  });
  return profile;
}

export const getProfileByPublicId = async(profilePublicId) => {
  return await prisma.profile.findUnique({
    where: {
      publicId: profilePublicId
    }
  })
  
}

export const getTotalProfiles = async({createdWhereObj}) => {
  return await prisma.profile.findMany({
    select: {
      publicId: true
    },
    where: createdWhereObj
  });
}

// Main Queries

// profileData has: name, pronouns, bio, userId
export const createProfileByUserId = async(profileData, createdSelectObj) => {
  const newProfile = await prisma.profile.create({
    data: {
      name: profileData.name,
      pronouns: profileData.pronouns,
      bio: profileData.bio,
      userId: profileData.userId
    },
    select: createdSelectObj
  });
  return newProfile;
}

export const findAllProfiles = async({take, skip, searchTerm, isSearchTermUUID , createdWhereObj, createdSortObj, createdSelectObj}) => {
  const profiles = await prisma.profile.findMany({
    take: take,
    skip: skip,
    where: createdWhereObj,
    orderBy: createdSortObj,
    select: createdSelectObj
  });
  return profiles;
}

export const findProfileByPublicId = async(profilePublicId, selectObj) => {
  const profile = await prisma.profile.findUnique({
    where: {
      publicId: profilePublicId
    },
    select: selectObj
  });
  return profile;
}

export const updateProfileByPublicId = async(profilePublicId, data, createdSelectObj) => {
  return await prisma.profile.update({
    where: {
      publicId: profilePublicId
    },
    data,
    select: createdSelectObj
  })
}

export const deleteProfileByPublicId = async(profilePublicId) => {
  return await prisma.profile.delete({
    where: {
      publicId: profilePublicId
    }
  })
}