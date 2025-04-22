import express, { NextFunction, Request, Response } from "express";
import { AdminControllers } from "./admin.controller";
const router = express.Router();

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log("Checker Middleware...");
  next();
};

router.get("/", AdminControllers.getAllAdmins);
router.get("/:id", AdminControllers.getAdminById);
router.patch("/:id", validateRequest, AdminControllers.updateAdmin);
router.delete("/:id", AdminControllers.deleteAdmin);
router.delete("/soft/:id", AdminControllers.softDeleteAdmin);

export const AdminRoutes = router;
