import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { StatusCodes } from "http-status-codes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Healthcare server",
  });
});

// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/admin", AdminRoutes);

app.use("/api/v1", router);
app.use(globalErrorHandler);

export default app;
