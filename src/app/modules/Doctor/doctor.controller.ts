import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { DoctorServices } from "./doctor.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorServices.updateDoctorIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor updated successfully",
    data: result,
  });
});

export const DoctorControllers = {
  insertIntoDB,
};
