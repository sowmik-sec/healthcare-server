import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCodes = StatusCodes.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = "Something went wrong!";
  let error = err;
  if (err instanceof Prisma.PrismaClientValidationError) {
    (statusCodes = 403), (message = "Validation Error");
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate Key Error";
      error = err.meta;
    }
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success,
    message,
    error,
  });
};

export default globalErrorHandler;
