import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";

import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserControllers.getAllAdmins
);

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createAdmin.parse(JSON.parse(req.body.data));
    return UserControllers.createAdmin(req, res);
  }
);
router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createDoctor.parse(JSON.parse(req.body.data));
    return UserControllers.createDoctor(req, res);
  }
);
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createPatient.parse(JSON.parse(req.body.data));
    return UserControllers.createPatient(req, res);
  }
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidation.updateStatus),
  UserControllers.changeProfileStatus
);

export const userRoutes = router;
