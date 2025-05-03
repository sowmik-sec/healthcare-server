import { AppointmentStatus, PaymentStatus } from "../../../generated/prisma";
import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";

const insertIntoDB = async (user: TAuthUser, payload: any) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
  });
};

export const PrescriptionServices = {
  insertIntoDB,
};
