import express from "express";
import { PaymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

router.post(
  "/init-payment/:appointmentId",
  auth(UserRole.PATIENT),
  PaymentControllers.initPayment
);

export const PaymentRoutes = router;
