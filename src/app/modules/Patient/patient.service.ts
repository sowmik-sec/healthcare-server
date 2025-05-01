import { Patient } from "../../../generated/prisma";
import prisma from "../../../shared/prisma";
import { IPatientUpdate } from "./patient.interface";

const updatePatientIntoDB = async (
  id: string,
  payload: Partial<IPatientUpdate>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;
  console.log(patientHealthData, medicalReport);
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    // update patient data
    const updatedPatient = await transactionClient.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });

    // create or update patient health data
    if (patientHealthData) {
      const healthData = await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }
    if (medicalReport) {
      {
        const report = await transactionClient.medicalReport.create({
          data: { ...medicalReport, patientId: patientInfo.id },
        });
      }
    }
  });

  const responseData = await prisma.patient.findUnique({
    where: {
      id: patientInfo.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return responseData;
};

const deletePatientFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (tx) => {
    // delete medical report
    await tx.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });
    await tx.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });
    const deletedPatient = await tx.patient.delete({
      where: {
        id,
      },
    });
    await tx.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });
    return deletedPatient;
  });
  return result;
};

const patientSoftDeleteIntoDB = async (id: string) => {};

export const PatientServices = {
  updatePatientIntoDB,
  deletePatientFromDB,
  patientSoftDeleteIntoDB,
};
