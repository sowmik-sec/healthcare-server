import express from "express";
import { MetaControllers } from "./meta.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PATIENT),
  MetaControllers.fetchDAshboardMetaData
);
export const MetaRoutes = router;
