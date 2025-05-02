import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";

const router = express.Router();

router.post("/", auth(UserRole.DOCTOR), DoctorScheduleControllers.insertIntoDB);
router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.getMySchedule
);
export const DoctorScheduleRoutes = router;
