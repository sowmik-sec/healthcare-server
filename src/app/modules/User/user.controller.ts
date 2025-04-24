import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { UserServices } from "./user.service";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

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

export const UserControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllAdmins,
};
