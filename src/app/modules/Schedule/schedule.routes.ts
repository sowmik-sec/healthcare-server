import express from "express";
import { ScheduleControllers } from "./schedule.controller";

const router = express.Router();

router.post("/", ScheduleControllers.insertIntoDB);

export const ScheduleRoutes = router;
