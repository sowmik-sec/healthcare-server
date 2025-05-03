import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PrescriptionServices } from "./prescription.service";
import { TAuthUser } from "../../interfaces/common";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionServices.insertIntoDB(user as TAuthUser, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Prescription created successfully",
      data: result,
    });
  }
);

export const PrescriptionController = {
  insertIntoDB,
};
