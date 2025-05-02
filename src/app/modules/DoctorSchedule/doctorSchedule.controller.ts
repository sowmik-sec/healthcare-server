import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../../shared/pick";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import { TAuthUser } from "../../interfaces/common";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleServices.insertIntoDB(
      user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Doctor schedule created successfully",
      data: result,
    });
  }
);

const getMySchedule = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate", "isBooked"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const user = req.user;

    const result = await DoctorScheduleServices.getMySchedule(
      filters,
      options,
      user as TAuthUser
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Schedule retrieved successfully",
      data: result,
    });
  }
);
const deleteFromDB = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await DoctorScheduleServices.deleteFromDB(
      user as TAuthUser,
      req.params.id
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Doctor schedule deleted successfully",
      data: result,
    });
  }
);

export const DoctorScheduleControllers = {
  insertIntoDB,
  getMySchedule,
  deleteFromDB,
};
