import { UserRole } from "../../../generated/prisma";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";

const createAdmin = async (req: any) => {
  const file: IFile = req.file;

  // console.log(req.body);

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    // console.log("Uploaded ", uploadToCloudinary);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
    // console.log(req.body);
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return createdAdminData;
  });
  return result;
};

export const UserService = {
  createAdmin,
};
