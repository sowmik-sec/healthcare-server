import express from "express";
import { DoctorControllers } from "./doctor.controller";
const router = express.Router();

router.get("/", DoctorControllers.getAllFromDB);

router.patch("/:id", DoctorControllers.insertIntoDB);
export const DoctorRoutes = router;
