import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
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

export default app;
