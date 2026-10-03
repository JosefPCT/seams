import { prisma } from "@repo/database"

// Helper Queries

export const findUserByEmail = async(targetEmail) => {
  return await prisma.user.findUnique({
    where: {
      email: targetEmail
    }
  });
}


// Main Queries

export const createNewUser = async(userData) => {
  return await prisma.user.create({
    data: {
      email: userData.email,
      hash: userData.hash,
      addtl: userData.first_name
    }
  })
}