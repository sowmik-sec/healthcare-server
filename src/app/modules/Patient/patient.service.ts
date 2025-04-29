import prisma from "../../../shared/prisma";

const updatePatientIntoDB = async (id: string, payload: any) => {
  const { patientHealthData, medicalReport, ...patientData } = payload;
  console.log(patientHealthData, medicalReport);
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    // update patient data
    const updatedPatient = await transactionClient.patient.update({
      where: {
        id,
      },
      data: payload,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });
  });

  // return result;
};

export const PatientServices = {
  updatePatientIntoDB,
};
