import { StatusCodes } from "http-status-codes";
import {
  AppointmentStatus,
  PaymentStatus,
  Prescription,
} from "../../../generated/prisma";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { TAuthUser } from "../../interfaces/common";

const insertIntoDB = async (
  user: TAuthUser,
  payload: Partial<Prescription>
) => {
  console.log(payload);
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: AppointmentStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });
  if (!(user?.email === appointmentData.doctor.email)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "This is not your appointment");
  }
  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate || null || undefined,
    },
    include: {
      patient: true,
    },
  });
  return result;
};

export const PrescriptionServices = {
  insertIntoDB,
};
