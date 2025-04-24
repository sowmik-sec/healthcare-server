import { z } from "zod";
import { Gender } from "../../../generated/prisma";

const createAdmin = z.object({
  password: z.string({ required_error: "Password is required" }),
  admin: z.object({
    name: z.string({ required_error: "Name required" }),
    email: z.string({ required_error: "Email required" }),
    contactNumber: z.string({ required_error: "Contact Number is required!" }),
  }),
});

const createDoctor = z.object({
  password: z.string({ required_error: "Password is required" }),
  doctor: z.object({
    name: z.string({ required_error: "Name required" }),
    email: z.string({ required_error: "Email required" }),
    contactNumber: z.string({ required_error: "Contact Number is required!" }),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: "Registration Number required",
    }),
    experience: z.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number({ required_error: "Fee is required" }),
    qualification: z.string({ required_error: "qualification is required" }),
    currentWorkingPlace: z.string({
      required_error: "Current working place is required",
    }),
    designation: z.string({ required_error: "Designation is required" }),
  }),
});

export const UserValidation = {
  createAdmin,
  createDoctor,
};
