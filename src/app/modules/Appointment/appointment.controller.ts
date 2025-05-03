import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../../shared/pick";
import { AppointmentServices } from "./appointment.service";
import { TAuthUser } from "../../interfaces/common";

const createAppointment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await AppointmentServices.createAppointment(
      user as TAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Appointment booked successfully",
      data: result,
    });
  }
);

export const AppointmentControllers = {
  createAppointment,
};
