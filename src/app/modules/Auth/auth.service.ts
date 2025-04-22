import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "../../../generated/prisma";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
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
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, "abcdefghij");
    const userData = await prisma.user.findUniqueOrThrow({
      where: {
        email: decodedData?.email,
        status: UserStatus.ACTIVE,
      },
    });
    const accessToken = jwtHelpers.generateToken(
      {
        email: userData?.email,
        role: userData?.role,
      },
      "abcde",
      "5m"
    );
    return {
      accessToken,
      needPasswordChange: userData.needPasswordChange,
    };
  } catch (error) {
    throw new Error("You are not authorized!");
  }
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
