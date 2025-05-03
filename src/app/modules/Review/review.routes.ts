import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { ReviewController } from "./review.controller";

const router = express.Router();

router.post("/", auth(UserRole.PATIENT), ReviewController.insertIntoDB);

export const ReviewRoutes = router;
