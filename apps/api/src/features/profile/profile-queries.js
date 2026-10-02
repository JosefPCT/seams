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

export const findSpecificProfileByUserId = async(profilePublicId) => {
  const profile = await prisma.profile.findUnique({
    where: {
      publicId: profilePublicId
    }
  });
  return profile;
}