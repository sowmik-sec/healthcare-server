import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ScheduleServices } from "./schedule.service";
import pick from "../../../shared/pick";
import { TAuthUser } from "../../interfaces/common";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});
const getAllFromDB = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req.query, ["startDate", "endDate"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const user = req.user;

    const result = await ScheduleServices.getAllFromDB(
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

export const ScheduleControllers = {
  insertIntoDB,
  getAllFromDB,
};
