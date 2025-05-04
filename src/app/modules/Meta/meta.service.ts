import { StatusCodes } from "http-status-codes";
import { UserRole } from "../../../generated/prisma";
import ApiError from "../../errors/ApiError";
import { TAuthUser } from "../../interfaces/common";

const fetchDAshboardMetaData = async (user: TAuthUser) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData();
      break;
    case UserRole.PATIENT:
      getPatientMetaData();
      break;
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid user role");
  }
};

const getAdminMetaData = async () => {};
const getSuperAdminMetaData = async () => {};
const getDoctorMetaData = async () => {};
const getPatientMetaData = async () => {};

export const MetaServices = {
  fetchDAshboardMetaData,
};
