import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Token generated successfully successfully",
    data: result,
    // data: {
    //   accessToken: result.accessToken,
    //   needPasswordChange: result.needPasswordChange,
    // },
  });
});
const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await AuthServices.changePassword(user, req.body);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgetPassword(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Check your email",
    data: null,
  });
});
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  const result = await AuthServices.resetPassword(token, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password Reset!",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
