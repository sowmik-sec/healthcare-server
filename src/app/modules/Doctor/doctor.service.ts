import prisma from "../../../shared/prisma";

const updateDoctorIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  //   if (!isDoctorExists) {
  //     throw new ApiError(StatusCodes.NOT_FOUND, "Doctor not found");
  //   }
  const result = await prisma.$transaction(async (transactionClient) => {
    const updatedDoctorData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });
    for (const specialtiesId of specialties) {
      const createDoctorSpecialties =
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialtiesId: specialtiesId,
          },
        });
    }
    return updatedDoctorData;
  });
  return result;
};

export const DoctorServices = {
  updateDoctorIntoDB,
};
