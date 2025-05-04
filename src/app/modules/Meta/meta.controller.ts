import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { MetaServices } from "./meta.service";
import { Request, Response } from "express";
import { TAuthUser } from "../../interfaces/common";

const fetchDAshboardMetaData = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    const result = await MetaServices.fetchDAshboardMetaData(user as TAuthUser);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Meta data retrieved Successfully",
      data: result,
    });
  }
);

export const MetaControllers = {
  fetchDAshboardMetaData,
};
