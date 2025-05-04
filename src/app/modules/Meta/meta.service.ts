import { StatusCodes } from "http-status-codes";
import { UserRole } from "../../../generated/prisma";
import ApiError from "../../errors/ApiError";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";

const fetchDAshboardMetaData = async (user: TAuthUser) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData(user as TAuthUser);
      break;
    case UserRole.PATIENT:
      getPatientMetaData();
      break;
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user role");
  }
};

const getSuperAdminMetaData = async () => {};
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
  });
};
const getDoctorMetaData = async (user: TAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
  });
};
const getPatientMetaData = async () => {};

export const MetaServices = {
  fetchDAshboardMetaData,
};
