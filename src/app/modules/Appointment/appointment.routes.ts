import express from "express";
import { AppointmentControllers } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
const router = express.Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointmentControllers.createAppointment
);

export const AppointmentRoutes = router;
