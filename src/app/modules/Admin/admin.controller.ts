import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../../../shared/pick";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, [
      "name",
      "email",
      "searchTerm",
      "contactNumber",
    ]);
    const result = await AdminServices.getAllAdminsFromDB(filters);
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
