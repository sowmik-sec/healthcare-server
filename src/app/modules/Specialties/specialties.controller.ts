import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { SpecialtiesServices } from "./specialties.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialtiesServices.insertIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Specialties created successfully",
    data: result,
  });
});

export const SpecialtiesControllers = {
  insertIntoDB,
};
