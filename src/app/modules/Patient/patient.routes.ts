import express, { NextFunction, Request, Response } from "express";
import { PatientController } from "./patient.controller";

const router = express.Router();

router.patch("/:id", PatientController.updatePatient);
router.delete("/:id", PatientController.deletePatient);
router.delete("/soft/:id", PatientController.patientSoftDelete);

export const PatientRoutes = router;
