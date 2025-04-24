import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createAdmin(req);
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
    const result = await UserService.createDoctor(req);
    res.status(200).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (error: any) {
    console.dir(error, { depth: "infinity" });
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
    });
  }
};

export const UserController = {
  createAdmin,
  createDoctor,
};
