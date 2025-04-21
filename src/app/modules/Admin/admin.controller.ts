import { Request, Response } from "express";
import { AdminServices } from "./admin.service";

const getAllAdmins = async (req: Request, res: Response) => {
  const result = await AdminServices.getAllAdminsFromDB();
  res.status(200).json({
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
};

export const AdminControllers = {
  getAllAdmins,
};
