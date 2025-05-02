import prisma from "../../../shared/prisma";
import { TAuthUser } from "../../interfaces/common";

const insertIntoDB = async (
  user: TAuthUser,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });
  console.log(payload.scheduleIds);
};

export const DoctorScheduleServices = {
  insertIntoDB,
};
