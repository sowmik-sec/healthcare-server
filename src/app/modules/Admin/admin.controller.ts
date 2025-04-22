import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constants";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

const getAllAdmins: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await AdminServices.getAllAdminsFromDB(filters, options);
  // res.status(200).json({
  //   success: true,
  //   message: "Admin retrieved successfully",
  //   meta: result.meta,
  //   data: result.data,
  // });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin retrieved Successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAdminByIdFromDB(req.params.id);
  // res.status(200).json({
  //   success: true,
  //   message: "Admin retrieved successfully",
  //   data: result,
  // });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin retrieved Successfully",
    data: result,
  });
});
const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.updateAdminIntoDB(req.params.id, req.body);
  // res.status(200).json({
  //   success: true,
  //   message: "Admin updated successfully",
  //   data: result,
  // });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});
const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.deleteAdminFromDB(req.params.id);
  // res.status(200).json({
  //   success: true,
  //   message: "Admin deleted successfully",
  //   data: result,
  // });
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin deleted Successfully",
    data: result,
  });
});
const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AdminServices.softDeleteAdminIntoDB(req.params.id);
    // res.status(200).json({
    //   success: true,
    //   message: "Admin deleted successfully",
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin deleted Successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const AdminControllers = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
