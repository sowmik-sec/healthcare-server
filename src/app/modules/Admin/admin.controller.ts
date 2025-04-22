import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constants";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AdminServices.getAllAdminsFromDB(filters, options);
    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};

const getAdminById = async (req: Request, res: Response) => {
  try {
    const result = await AdminServices.getAdminByIdFromDB(req.params.id);
    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};

export const AdminControllers = {
  getAllAdmins,
  getAdminById,
};
