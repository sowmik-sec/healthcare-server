import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import {
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "../../../generated/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const createAppointment = async (user: TAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });
  const videoCallingId: string = uuidv4();
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    // healthcare-datetime
    const today = new Date();
    const transactionId =
      "Healthcare-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes() +
      "-" +
      today.getSeconds();
    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });
  return result;
};

const getMyAppointment = async (
  user: TAuthUser,
  filters: any,
  options: TPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { ...filterData } = filters;
  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include:
      user?.role === UserRole.PATIENT
        ? { doctor: true, schedule: true }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
            schedule: true,
          },
  });
  const total = await prisma.appointment.count({
    where: whereConditions,
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const changeAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus,
  user: TAuthUser
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === UserRole.DOCTOR) {
    if (!(user.email === appointmentData.doctor.email)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This is not your appointment"
      );
    }
  }

  const result = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
  });
  return result;
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinuteAgo = new Date(Date.now() - 30 * 60 * 1000);
  const unpaidAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinuteAgo,
      },
      paymentStatus: PaymentStatus.UNPAID,
    },
  });
  const appointmentIdsToCancel = unpaidAppointments.map(
    (appointment) => appointment.id
  );

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
    });
    await tx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIdsToCancel,
        },
      },
    });
    await tx.doctorSchedules.updateMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
      data: {
        isBooked: false,
      },
    });
  });
};

export const AppointmentServices = {
  createAppointment,
  getMyAppointment,
  changeAppointmentStatus,
  cancelUnpaidAppointments,
};
