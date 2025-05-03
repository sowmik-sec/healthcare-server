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
const getMyAppointment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await AppointmentServices.getMyAppointment(
      user as TAuthUser,
      filters,
      options
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Appointment retrieved successfully",
      data: result,
    });
  }
);

const changeAppointmentStatus = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const { status } = req.body;
    const result = await AppointmentServices.changeAppointmentStatus(
      req.params.id,
      status
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Appointment status changed successfully",
      data: result,
    });
  }
);
export const AppointmentControllers = {
  createAppointment,
  getMyAppointment,
  changeAppointmentStatus,
};
