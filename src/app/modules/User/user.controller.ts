import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { UserServices } from "./user.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { TAuthUser } from "../../interfaces/common";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};
const createDoctor = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.createDoctor(req);
    res.status(200).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};
const createPatient = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.createPatient(req);
    res.status(200).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};

const getAllAdmins = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await UserServices.getAllAdminsFromDB(filters, options);
  // res.status(200).json({
  //   success: true,
  //   message: "Admin retrieved successfully",
  //   meta: result.meta,
  //   data: result.data,
  // });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.changeProfileStatusIntoDB(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Status changed successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};

const getMyProfile = async (
  req: Request & { user?: TAuthUser },
  res: Response
) => {
  try {
    const user = req.user;
    const result = await UserServices.getMyProfile(user as TAuthUser);
    res.status(200).json({
      success: true,
      message: "My profile retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};
const updateMyProfile = async (
  req: Request & { user?: TAuthUser },
  res: Response
) => {
  try {
    const user = req.user;
    const result = await UserServices.updateMyProfile(user as TAuthUser, req);
    res.status(200).json({
      success: true,
      message: "My profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};

export const UserControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllAdmins,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
