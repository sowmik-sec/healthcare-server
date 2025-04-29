import prisma from "../../../shared/prisma";

const updateDoctorIntoDB = async (id: string, payload: any) => {
  const isDoctorExists = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  //   if (!isDoctorExists) {
  //     throw new ApiError(StatusCodes.NOT_FOUND, "Doctor not found");
  //   }
  const result = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

export const DoctorServices = {
  updateDoctorIntoDB,
};
