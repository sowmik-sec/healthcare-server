import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  //   console.log(req.body);
  const result = await UserService.createAdmin(req.body);
  res.send(result);
};

export const UserController = {
  createAdmin,
};
