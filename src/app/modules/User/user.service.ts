import { UserRole } from "../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";

const createAdmin = async (req: any) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    // console.log("Uploaded ", uploadToCloudinary);
    req.body.data.admin.profilePhoto = uploadToCloudinary?.secure_url;
    console.log(req.body.data);
  }

  // const hashedPassword: string = await bcrypt.hash(data.password, 12);
  // const userData = {
  //   email: data.admin.email,
  //   password: hashedPassword,
  //   role: UserRole.ADMIN,
  // };
  // const result = await prisma.$transaction(async (transactionClient) => {
  //   await transactionClient.user.create({
  //     data: userData,
  //   });
  //   const createdAdminData = await transactionClient.admin.create({
  //     data: data.admin,
  //   });
  //   return createdAdminData;
  // });
  // return result;
};

export const UserService = {
  createAdmin,
};
