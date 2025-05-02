import express from "express";
import { ScheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ScheduleControllers.insertIntoDB
);

router.get("/", auth(UserRole.DOCTOR), ScheduleControllers.getAllFromDB);

export const ScheduleRoutes = router;
