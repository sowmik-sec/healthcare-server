import prisma from "../../../shared/prisma";

const updatePatientIntoDB = async (id: string, payload: any) => {
  const result = await prisma.patient.update({
    where: {
      id,
    },
    data: payload,
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return result;
};

export const PatientServices = {
  updatePatientIntoDB,
};
