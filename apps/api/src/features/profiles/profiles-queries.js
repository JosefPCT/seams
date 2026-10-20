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

export const getTotalProfiles = async() => {
  return await prisma.profile.findMany({
    select: {
      publicId: true
    }
  });
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
    },
    select: {
      publicId: true,
      name: true,
      pronouns: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          publicId: true,
          email: true,
          addtl: true,
          isAdmin: true
        }
      }
    }
  });
  return newProfile;
}

export const findAllProfiles = async({take, skip, searchTerm, isSearchTermUUID , sortOrder, sortBy}, selectObj) => {
  const profiles = await prisma.profile.findMany({
    take: take,
    skip: skip,
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { bio: { contains: searchTerm, mode: "insensitive"}},
        { pronouns: { contains: searchTerm, mode: 'insensitive'}},
        { publicId: isSearchTermUUID ? searchTerm : undefined},
        {
          user: isSearchTermUUID
            ? {
                is: {
                  publicId: searchTerm,
                },
              }
            : undefined,
        },
        {
          user: { is: {
            email: { contains: searchTerm, mode: 'insensitive'}
          }}
        }
      ],
    },
    orderBy: {
      [sortBy]: sortOrder
    },
    select: selectObj
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

export const updateProfileByPublicId = async(profilePublicId, data) => {
  return await prisma.profile.update({
    where: {
      publicId: profilePublicId
    },
    data,
  })
}

export const deleteProfileByPublicId = async(profilePublicId) => {
  return await prisma.profile.delete({
    where: {
      publicId: profilePublicId
    }
  })
}