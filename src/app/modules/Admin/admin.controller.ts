import { Request, Response } from "express";
import { AdminServices } from "./admin.service";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const result = await AdminServices.getAllAdminsFromDB(req.query);
    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};

export const AdminControllers = {
  getAllAdmins,
};
