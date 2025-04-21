import { Prisma, PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (params: any) => {
  const orConditions: Prisma.AdminWhereInput[] = [];
  const adminSearchableFields = ["name", "email"];
  if (params.searchTerm) {
    orConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  const whereConditions: Prisma.AdminWhereInput = { AND: orConditions };
  console.dir(whereConditions, { depth: "infinity" });
  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};

export const AdminServices = {
  getAllAdminsFromDB,
};
