import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { Prisma, Schedule } from "../../../generated/prisma";
import { ISchedule } from "./schedule.interface";
import { IPatientFilterRequest } from "../Patient/patient.interface";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { TAuthUser } from "../../interfaces/common";

const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
};

const insertIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;
  const intervalTime = 30;
  const schedules = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (currentDate <= lastDate) {
    const startDatetime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );
    const endDatetime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    while (startDatetime < endDatetime) {
      // const scheduleData = {
      //   startDatetime,
      //   endDatetime: addMinutes(startDatetime, intervalTime),
      // };
      const s = await convertDateTime(startDatetime);
      const e = await convertDateTime(addMinutes(startDatetime, intervalTime));

      const scheduleData = {
        startDateTime: s,
        endDateTime: e,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDatetime.setMinutes(startDatetime.getMinutes() + intervalTime);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const getAllFromDB = async (
  filters: any,
  options: TPaginationOptions,
  user: TAuthUser
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const andConditions = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });
  console.log(doctorSchedules);

  const result = await prisma.schedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.schedule.count({
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
export const ScheduleServices = {
  insertIntoDB,
  getAllFromDB,
};
