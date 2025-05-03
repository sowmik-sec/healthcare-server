import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import { StatusCodes } from "http-status-codes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { AppointmentServices } from "./app/modules/Appointment/appointment.service";
const app: Application = express();
import corn from "node-cron";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

corn.schedule("* * * * *", () => {
  try {
    AppointmentServices.cancelUnpaidAppointments();
  } catch (error) {}
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Healthcare server",
  });
});

// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/admin", AdminRoutes);

app.use("/api/v1", router);
app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found",
    },
  });
});

export default app;
