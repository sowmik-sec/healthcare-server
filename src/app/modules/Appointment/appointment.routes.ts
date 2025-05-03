import express from "express";
import { AppointmentControllers } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
const router = express.Router();

router.get(
  "/get-my-appointment",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  AppointmentControllers.getMyAppointment
);

router.post(
  "/",
  auth(UserRole.PATIENT),
  AppointmentControllers.createAppointment
);
router.patch(
  "/status/:id",
  auth(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AppointmentControllers.changeAppointmentStatus
);

export const AppointmentRoutes = router;
