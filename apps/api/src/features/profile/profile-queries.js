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

// Main Queries

// profileData has: name, pronouns, bio, userId
export const createProfileByUserId = async(profileData) => {
  const newProfile = await prisma.profile.create({
    data: {
      name: profileData.name,
      pronouns: profileData.pronouns,
      bio: profileData.bio,
      userId: profileData.userId
    }
  });
  return newProfile;
}

export const findAllProfiles = async() => {
  const profiles = await prisma.profile.findMany();
  return profiles;
}

export const findSpecificProfileByProfileId = async(profilePublicId) => {
  const profile = await prisma.profile.findUnique({
    where: {
      publicId: profilePublicId
    }
  });
  return profile;
}

export const updateProfileByPublicId = async(profilePublicId, data) => {
  return await prisma.profile.update({
    where: {
      publicId: profilePublicId
    },
    data,
  })
}