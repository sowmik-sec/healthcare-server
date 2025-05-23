import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { PrescriptionController } from "./prescription.controller";

const router = express.Router();

router.get(
  "/my-prescription",
  auth(UserRole.DOCTOR, UserRole.PATIENT),
  PrescriptionController.patientPrescription
);
router.post("/", auth(UserRole.DOCTOR), PrescriptionController.insertIntoDB);

export const PrescriptionRoutes = router;
