import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ReviewServices } from "./review.service";
import { TAuthUser } from "../../interfaces/common";
const insertIntoDB = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await ReviewServices.createReviewIntoDB(
      user as TAuthUser,
      req.body
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

export const ReviewController = {
  insertIntoDB,
};
