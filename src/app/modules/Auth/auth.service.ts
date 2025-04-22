import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelpers";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password Incorrect");
  }
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcde",
    "5m"
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefghij",
    "30d"
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  console.log("refresh token", token);
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
