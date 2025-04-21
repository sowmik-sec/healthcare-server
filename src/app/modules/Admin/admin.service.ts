import { Prisma, PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

const getAllAdminsFromDB = async (params: any) => {
  console.log({ params });
  const orConditions: Prisma.AdminWhereInput[] = [];
  if (params.searchTerm) {
    orConditions.push({
      OR: [
        {
          name: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
      ],
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
