import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

export const AdminServices = {
  getAllAdminsFromDB,
};
