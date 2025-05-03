import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PaymentServices } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.initPayment();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

export const PaymentControllers = {
  initPayment,
};
