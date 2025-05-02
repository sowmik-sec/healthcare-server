import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../../shared/prisma";
import { Schedule } from "../../../generated/prisma";

const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
};

const insertIntoDB = async (payload: any): Promise<Schedule[]> => {
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

export const ScheduleServices = {
  insertIntoDB,
};
