import express, { NextFunction, Request, Response } from "express";
import { AdminControllers } from "./admin.controller";
const router = express.Router();
import { AnyZodObject, z } from "zod";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidations } from "./admin.validations";

router.get("/", AdminControllers.getAllAdmins);
router.get("/:id", AdminControllers.getAdminById);
router.patch(
  "/:id",
  validateRequest(AdminValidations.updateAdminZodSchema),
  AdminControllers.updateAdmin
);
router.delete("/:id", AdminControllers.deleteAdmin);
router.delete("/soft/:id", AdminControllers.softDeleteAdmin);

export const AdminRoutes = router;
