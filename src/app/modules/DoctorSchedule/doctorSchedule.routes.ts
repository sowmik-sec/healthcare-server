import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";

const router = express.Router();

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.getMySchedule
);
router.post("/", auth(UserRole.DOCTOR), DoctorScheduleControllers.insertIntoDB);
router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.deleteFromDB
);
export const DoctorScheduleRoutes = router;
