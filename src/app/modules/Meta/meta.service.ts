import { StatusCodes } from "http-status-codes";
import { PaymentStatus, UserRole } from "../../../generated/prisma";
import ApiError from "../../errors/ApiError";
import { TAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";

const fetchDAshboardMetaData = async (user: TAuthUser) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      metaData = getDoctorMetaData(user as TAuthUser);
      break;
    case UserRole.PATIENT:
      metaData = getPatientMetaData(user);
      break;
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user role");
  }
  return metaData;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const adminCount = await prisma.admin.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  return {
    doctorCount,
    patientCount,
    adminCount,
    appointmentCount,
    paymentCount,
    totalRevenue,
  };
};
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });
  return {
    doctorCount,
    patientCount,
    appointmentCount,
    paymentCount,
    totalRevenue,
  };
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
  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
  });
  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData.id,
    },
  });
  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status: status,
      count: Number(_count.id),
    }));

  return {
    patientCount: patientCount.length,
    appointmentCount,
    reviewCount,
    totalRevenue,
    formattedAppointmentStatusDistribution,
  };
};
const getPatientMetaData = async (user: TAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });
  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });
  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      patientId: patientData.id,
    },
  });
  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status: status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    formattedAppointmentStatusDistribution,
  };
};

export const MetaServices = {
  fetchDAshboardMetaData,
};
