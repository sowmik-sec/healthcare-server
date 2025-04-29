import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesControllers } from "./specialties.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialtiesValidation } from "./specialties.validation";
const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.createSpecialtiesZodSchema.parse(
      JSON.parse(req.body.data)
    );
    return SpecialtiesControllers.insertIntoDB(req, res, next);
  }
);

export const SpecialtiesRoutes = router;
