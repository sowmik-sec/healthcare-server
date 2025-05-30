import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { UserStatus } from "../../../generated/prisma";
import config from "../../../config";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

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
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
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
      config.jwt.jwt_secret as Secret,
      config.jwt.jwt_expires_in as string
    );
    return {
      accessToken,
      needPasswordChange: userData.needPasswordChange,
    };
  } catch (error) {
    throw new Error("You are not authorized!");
  }
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password Incorrect");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);
  const result = await prisma.user.update({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "Password changed successfully",
  };
};

const forgetPassword = async (payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  console.log({ userData });
  const resetPasswordToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_password_token as Secret,
    config.jwt.reset_password_expires_in as string
  );
  // http://localhost:3000/reset-pass?userId=id&token=hxwoxfdsh
  const resetPassLink =
    config.reset_pass_link +
    `?userId=${userData.id}&token=${resetPasswordToken}`;
  await emailSender(
    userData.email,
    `
      <div>
        <p>Dear User,</p>
        <p>Your password reset link 
          <a href=${resetPassLink}>
            <button>Reset Password</button>
          </a>
        </p>
      </div>
    `
  );
  console.log(resetPassLink);
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_password_token as Secret
  );
  if (!isValidToken) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
  }
  // hash password
  // update into database
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  const result = await prisma.user.update({
    where: {
      email: payload.id,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return result;
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
