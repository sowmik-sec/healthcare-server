import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";

const createAppointment = async (user: TAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  console.log(payload);
};

export const AppointmentServices = {
  createAppointment,
};
