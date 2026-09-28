import { prisma } from "@repo/database"

export const fetchSampleUser = async() => {
  const user = await prisma.user.findFirst();
  return user;
}