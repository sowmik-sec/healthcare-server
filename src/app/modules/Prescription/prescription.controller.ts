import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PrescriptionServices } from "./prescription.service";
import { TAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await PrescriptionServices.insertIntoDB(
      user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Prescription created successfully",
      data: result,
    });
  }
);

const patientPrescription = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await PrescriptionServices.patientPrescription(
      user as TAuthUser,
      options
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Prescription retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const PrescriptionController = {
  insertIntoDB,
  patientPrescription,
};
