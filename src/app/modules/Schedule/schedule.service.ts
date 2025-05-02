import { addHours, addMinutes, format } from "date-fns";

const insertIntoDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const intervalTime = 30;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  while (currentDate <= endDate) {
    const startDatetime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      )
    );
    const endDatetime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      )
    );
    while (startDatetime < endDatetime) {
      const scheduleData = {
        startDatetime,
        endDatetime: addMinutes(startDatetime, intervalTime),
      };
    }
  }
};

export const ScheduleServices = {
  insertIntoDB,
};
