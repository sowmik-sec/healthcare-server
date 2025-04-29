import express, { NextFunction, Request, Response } from "express";
import { PatientController } from "./patient.controller";

const router = express.Router();

router.patch("/:id", PatientController.updatePatient);

export const PatientRoutes = router;
