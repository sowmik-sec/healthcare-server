import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const insertIntoDB = async (req: Request & { file?: IFile }) => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

export const SpecialtiesServices = {
  insertIntoDB,
};
