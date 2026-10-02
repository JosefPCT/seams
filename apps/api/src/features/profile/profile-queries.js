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
  })
}

